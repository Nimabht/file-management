import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class WhitelistedIP extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the whitelisted IP',
  })
  id: number;

  @ApiProperty({
    example: '192.168.0.1',
    description: 'The IP address that is whitelisted',
  })
  @Column()
  ipAddress: string;
}
