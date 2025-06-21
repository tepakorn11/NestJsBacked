import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';


export class CreatePeopleUserDto {
  @ApiProperty({ example: 55, description: 'อายุต้องเป็นตัวเลขเท่านั้น' })
  @IsNumber({}, { message: 'อายุต้องเป็นตัวเลขเท่านั้น' })
  age: number;

  @ApiPropertyOptional({ example: 'Jonathan', description: 'ชื่อจริงของผู้ใช้ ไม่เกิน 50 ตัวอักษร' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'ชื่อไม่ควรเกิน 50 ตัวอักษร' })
  f_name?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'นามสกุลของผู้ใช้ ไม่เกิน 50 ตัวอักษร' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'นามสกุลไม่ควรเกิน 50 ตัวอักษร' })
  l_name?: string;

  @ApiPropertyOptional({ example: 'Johnny', description: 'ชื่อเล่น ไม่เกิน 20 ตัวอักษร' })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'นามสกุลไม่ควรเกิน 20 ตัวอักษร' })
  n_name?: string;

  @ApiPropertyOptional({ example: 'Jonathan Doe', description: 'ชื่อเต็ม ความยาวระหว่าง 3–100 ตัวอักษร' })
  @IsOptional()
  @IsString()
  @Length(3, 100, { message: 'ชื่อเต็มต้องมีความยาว 3-100 ตัวอักษร' })
  full_name?: string;

  @ApiPropertyOptional({ example: 1, description: 'รหัสสิทธิ์การใช้งาน เช่น 1 = admin' })
  @IsOptional()
  @IsNumber()
  rule?: number;

  @ApiPropertyOptional({ example: 0, description: 'จำนวนวิชาที่เกี่ยวข้อง' })
  @IsOptional()
  @IsNumber()
  total_subject?: number;
}
