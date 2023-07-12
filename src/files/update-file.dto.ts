import {
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsIP,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty({
    example: 10,
    description: 'The maximum download limit (minimum is 0)',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  downloadLimit: number;

  @ApiProperty({
    example: ['192.168.0.1', '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF'],
    description: 'An array of valid whitelisted IP addresses (IPv4/IPv6)',
  })
  @IsArray()
  @IsOptional()
  @IsIP(undefined, { each: true })
  whitelistedIPs: string[];
}
