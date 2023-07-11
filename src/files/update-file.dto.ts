import {
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsIP,
  IsOptional,
} from 'class-validator';

export class UpdateFileDto {
  @IsNumber()
  @IsOptional()
  downloadLimit: number;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsIP(undefined, { each: true })
  whitelistedIPs: string[];
}
