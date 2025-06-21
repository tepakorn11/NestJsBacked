import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';

export class CreateShowCaseDto {

    @ApiProperty({ example: 1, description: 'UserId ของคนที่จะทำการ update' })
    @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
    user_id: number;

    @ApiProperty({ example: 2024, description: 'ปีการศึกษา' })
    @IsOptional()
    @IsNumber({}, { message: 'ตัวเลขเท่านั้น' })
    year: number;

    @ApiProperty({ example: 'สร้างบัคให้บริษัท', description: 'หัวข้อ' })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({ example: 'สร้างบัคให้บริษัท abc จนพังหมด', description: 'รายะเอียด' })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ example: 'mdi:robot', description: 'ใช้ของ mdiฝั่ง fronted' })
    @IsOptional()
    @IsString()
    icon: string;
}
