import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { WhitelistedIP } from './entities/whitelistIPs.entity';
import { UpdateFileDto } from './update-file.dto';
import { createReadStream } from 'fs';
import { lookup } from 'mime-types';
import { join } from 'path';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { HeadersDto } from './headers.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(WhitelistedIP)
    private whiteListedIpRepository: Repository<WhitelistedIP>,
  ) {}

  async getAllFiles(): Promise<File[]> {
    return this.fileRepository.find({ relations: ['whitelistedIPs'] });
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.whitelistedIPs', 'whitelistedIPs')
      .where('file.id = :id', { id })
      .getOne();

    if (!file) {
      throw new NotFoundException(`File with ID:${id} not found.`);
    }
    return file;
  }

  async uploadFile(fileName: string): Promise<File> {
    const newFile = this.fileRepository.create({
      fileName: fileName,
    });
    await this.fileRepository.save(newFile);
    return newFile;
  }

  async updateFile(
    fileId: string,
    updateFileDto: UpdateFileDto,
  ): Promise<File> {
    const { downloadLimit, whitelistedIPs } = updateFileDto;
    const file = await this.getFileById(fileId);

    if (downloadLimit !== undefined) file.remaining_downloads = downloadLimit;

    if (!!whitelistedIPs) {
      const newWhiteListIPs = [];
      for (let i = 0; i < whitelistedIPs.length; i++) {
        const existingIP = await this.whiteListedIpRepository.findOneBy({
          ipAddress: whitelistedIPs[i],
        });
        if (!existingIP) {
          const newIp = new WhitelistedIP();
          newIp.ipAddress = whitelistedIPs[i];
          await this.whiteListedIpRepository.save(newIp);
          newWhiteListIPs.push(newIp);
        } else {
          newWhiteListIPs.push(existingIP);
        }
      }
      file.whitelistedIPs = newWhiteListIPs;
    }
    await this.fileRepository.save(file);
    return file;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileById(fileId);
    await this.fileRepository.remove(file);
  }

  async createStream(fileId: string): Promise<ReadStream> {
    const file = await this.getFileById(fileId);
    return createReadStream(join(__dirname, '../../uploads', file.fileName));
  }

  async getHeaders(fileId: string): Promise<HeadersDto> {
    const file = await this.getFileById(fileId);
    const mimeType = lookup(join(__dirname, '../../uploads', file.fileName));
    return {
      mimeType,
      filename: file.fileName,
    };
  }

  async download(fileId: string, ip: string): Promise<void> {
    const file = await this.getFileById(fileId);

    if (file.remaining_downloads < 1)
      throw new ForbiddenException('File is limited.');

    const isValid = file.whitelistedIPs.find((whiteListIp) => {
      return whiteListIp.ipAddress === ip;
    });

    if (!isValid)
      throw new ForbiddenException(`File is limited for ip ${ip} .`);

    file.remaining_downloads--;
    await this.fileRepository.save(file);
  }
}
