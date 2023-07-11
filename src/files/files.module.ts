import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { WhitelistedIP } from './entities/whitelistIPs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, WhitelistedIP])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
