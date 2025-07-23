import { PartialType } from '@nestjs/swagger';
import { CreateShowCaseDto } from './create-show-case.dto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Matches
} from 'class-validator';

export class UpdateShowCaseDto extends PartialType(CreateShowCaseDto) {
  @ApiProperty({ example: 101, description: 'ID ของ ShowCase ที่ต้องการอัปเดต' })
  @IsNumber({}, { message: 'id ต้องเป็นตัวเลข' })
  id: number;

  @ApiPropertyOptional({ example: 'active/in-active', description: 'สถานะเมนู' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '2566', description: 'ปีเริ่มทำงาน (พ.ศ.)' })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'ปีต้องเป็นตัวเลขเท่านั้น' })
  start_working?: string;

  @ApiPropertyOptional({ example: '2567', description: 'ปีสิ้นสุดการทำงาน (พ.ศ.)' })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'ปีต้องเป็นตัวเลขเท่านั้น' })
  end_working?: string;
}
