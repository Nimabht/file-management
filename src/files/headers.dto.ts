import { ApiProperty } from '@nestjs/swagger';

export class HeadersDto {
  mimeType: string | false;

  filename: string;
}
