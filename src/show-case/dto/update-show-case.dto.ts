import { PartialType } from '@nestjs/swagger';
import { CreateShowCaseDto } from './create-show-case.dto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateShowCaseDto extends PartialType(CreateShowCaseDto) {
  @ApiProperty({ example: 101, description: 'ID ของ ShowCase ที่ต้องการอัปเดต' })
  @IsNumber({}, { message: 'id ต้องเป็นตัวเลข' })
  id: number;

  @ApiProperty({ example: 'active/in-active', description: 'เปิด/ปิด' })
  @IsString()
  status?: string;

  @ApiProperty({ example: '2024-01-01', description: 'วันที่เริ่มทำงาน' })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'วันที่ต้องเป็นรูปแบบ YYYY-MM-DD' })
  start_working: string

  @ApiProperty({ example: '2024-01-01', description: 'วันที่ออก (ถ้าถึงปัจจุบันไม่ต้องใส่)' })
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'วันที่ต้องเป็นรูปแบบ YYYY-MM-DD' })
  end_working: string;
}
