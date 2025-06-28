import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';
export class CreateRoadMapDto {

    @ApiProperty({ example: 2537, description: 'ปี' })
    @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
    year: number;

    @ApiProperty({ example: 'การพัฒนาเว็บแอปพลิเคชัน', description: 'หัวข้อ' })
    @IsString()
    @IsOptional()
    @MaxLength(100, { message: 'หัวข้อไม่ควรเกิน 100 ตัวอักษร' })
    title: string;

    @ApiPropertyOptional({ example: 'การพัฒนาเว็บแอปพลิเคชันที่ใช้เทคโนโลยีล่าสุด', description: 'รายละเอียด' })
    @IsOptional()
    description: string;


    @ApiProperty({ example: 'mdi:robot', description: 'ใช้ของ mdiฝั่ง fronted' })
    @IsOptional()
    @IsString()
    icon: string;





}
