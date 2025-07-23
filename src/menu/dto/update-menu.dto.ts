import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ example: 'in-active', description: 'สถานะของเมนู' })
  status: string;
}
