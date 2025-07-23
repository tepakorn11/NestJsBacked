import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
export class CreateMenuDto {
  @ApiProperty({ example: 2, description: 'ลำดับที่จะแสดง' })
  @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
  level_id: number;

  @ApiProperty({ example: 'MyShop', description: 'ชื่อเมนู' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'active', description: 'สถานะ' })
  @IsString()
  @IsOptional()
  status: string = 'active';
}
