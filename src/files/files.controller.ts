import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Patch,
  Body,
  BadRequestException,
  StreamableFile,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File } from './entities/file.entity';
import { UpdateFileDto } from './update-file.dto';
import { Request, Response } from 'express';
import { HeadersDto } from './headers.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiFoundResponse({
    status: 200,
    description: 'Returns an array of all files',
    type: File,
    isArray: true,
  })
  @Get()
  async getAllFiles(): Promise<File[]> {
    return this.filesService.getAllFiles();
  }

  @Get(':fileId')
  @ApiFoundResponse({
    status: 200,
    description: 'Returns the file with the specified ID',
    type: File,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found',
  })
  @Get(':fileId')
  async getFileById(@Param('fileId') fileId: string): Promise<File> {
    return this.filesService.getFileById(fileId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(201)
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
  @ApiCreatedResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: File,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @ApiSecurity('bearerAuth')
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
    if (!file) throw new BadRequestException("File doesn't exists.");
    return this.filesService.uploadFile(file.filename);
  }

  @ApiResponse({
    status: 200,
    description: 'Updates the file with the specified ID',
    type: File,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiBearerAuth()
  @ApiSecurity('bearerAuth')
  @UseGuards(AuthGuard)
  @Patch(':fileId')
  async updateFile(
    @Param('fileId') fileId: string,
    @Body() updateDto: UpdateFileDto,
  ): Promise<File> {
    return this.filesService.updateFile(fileId, updateDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Downloads the file with the specified ID',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found',
  })
  @Get('/:fileId/download')
  async getFile(
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    await this.filesService.download(fileId, req.ip);
    const stream = await this.filesService.createStream(fileId);
    const Headers: HeadersDto = await this.filesService.getHeaders(fileId);
    res.set({
      'Content-Type': Headers.mimeType,
      'Content-Disposition': `attachment; filename="${Headers.filename}"`,
    });
    return new StreamableFile(stream);
  }

  @ApiResponse({
    status: 204,
    description: 'Deletes the file with the specified ID',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiBearerAuth()
  @ApiSecurity('bearerAuth')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<void> {
    this.filesService.deleteFile(fileId);
  }
}
