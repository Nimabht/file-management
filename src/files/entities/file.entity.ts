import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { WhitelistedIP } from './whitelistIPs.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class File {
  @ApiProperty({
    example: 'd2071b7d-07f2-4a39-a37e-2d7d448e4a9e',
    description: 'The unique identifier of the file',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'example.txt',
    description: 'The name of the file',
  })
  @Column()
  fileName: string;

  @ApiProperty({
    example: 0,
    description: 'The remaining number of downloads for the file',
  })
  @Column({ default: 0 })
  remaining_downloads: number;

  @ManyToMany(() => WhitelistedIP, {
    cascade: true,
  })
  @JoinTable({ name: 'file_whiteListIP' })
  @ApiProperty({
    type: () => WhitelistedIP,
    isArray: true,
    description: 'The list of whitelisted IP addresses for the file',
  })
  whitelistedIPs: WhitelistedIP[];
}
