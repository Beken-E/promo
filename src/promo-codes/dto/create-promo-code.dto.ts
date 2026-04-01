import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';

export class CreatePromoCodeDto {
  @ApiProperty({ example: 'SUMMER2026' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  discount: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({ example: '2026-12-31T23:59:59Z' })
  @IsDateString()
  expiresAt: string;
}
