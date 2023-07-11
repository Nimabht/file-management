import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File } from './entities/file.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async getAllFiles(): Promise<File[]> {
    return this.filesService.getAllFiles();
  }

  @Get(':fileId')
  async getFileById(@Param('fileId') fileId: string): Promise<File> {
    return this.filesService.getFileById(fileId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
    return this.filesService.uploadFile(file.filename);
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<void> {
    this.filesService.deleteFile(fileId);
  }
}
