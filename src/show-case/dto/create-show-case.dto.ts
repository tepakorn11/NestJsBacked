import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateShowCaseDto {
  @ApiProperty({ example: 1, description: 'UserId ของคนที่จะทำการ update' })
  @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
  user_id: number;

  @ApiProperty({ example: 'สร้างบัคให้บริษัท', description: 'หัวข้อ' })
  @IsOptional()
  @IsString()
  business_name: string;

  @ApiProperty({
    example: 'สร้างบัคให้บริษัท abc จนพังหมด',
    description: 'รายะเอียด',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'mdi:robot', description: 'ใช้ของ mdiฝั่ง fronted' })
  @IsOptional()
  @IsString()
  icon: string;

  @ApiProperty({ example: 50000, description: 'เงินเดือนที่ได้' })
  @IsOptional()
  @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
  salary: number;

  @ApiProperty({ example: '2566', description: 'ปีที่เริ่มทำงาน (พ.ศ.)' })
  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'ปีต้องเป็นตัวเลข 4 หลัก เช่น 2566' })
  @Matches(/^\d{4}$/, { message: 'ปีต้องเป็นตัวเลขเท่านั้น' })
  start_working: string;

  @ApiProperty({ example: '2568', description: 'ปีที่สิ้นสุดการทำงาน (พ.ศ.)' })
  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'ปีต้องเป็นตัวเลข 4 หลัก เช่น 2566' })
  @Matches(/^\d{4}$/, { message: 'ปีต้องเป็นตัวเลขเท่านั้น' })
  end_working: string;

  @ApiProperty({ example: 'active', description: 'สถานะใช้งาน/ไม่ใช้งาน' })
  @IsOptional()
  @IsString()
  status: string = 'active';
}
