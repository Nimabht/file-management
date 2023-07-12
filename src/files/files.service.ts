import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { WhitelistedIP } from './entities/whitelistIPs.entity';
import { UpdateFileDto } from './update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(File)
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

    if (!!downloadLimit) file.remaining_downloads = downloadLimit;

    if (!!whitelistedIPs) {
      const newIp = new WhitelistedIP();
      newIp.ipAddress = whitelistedIPs[0];
      file.whitelistedIPs = [newIp];
      await this.fileRepository.save(file);
      await this.whiteListedIpRepository.save(newIp);

      // const IPs = [];
      // whitelistedIPs.map(async (ip) => {
      //   const newIp = new WhitelistedIP();
      //   newIp.ipAddress = ip;
      //   await this.whiteListedIpRepository.save(newIp);
      //   IPs.push(newIp);
      // });
      // file.whitelistedIPs = IPs;
    }

    await this.fileRepository.save(file);
    return file;
  }

  //TODO:check if its actually works
  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileById(fileId);
    await this.whiteListedIpRepository.remove(file.whitelistedIPs);
    await this.fileRepository.remove(file);
  }
}
