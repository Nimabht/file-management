import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async uploadFile(fileName: string): Promise<File> {
    const newFile = this.fileRepository.create({
      fileName: fileName,
    });
    await this.fileRepository.save(newFile);
    return newFile;
  }
}
