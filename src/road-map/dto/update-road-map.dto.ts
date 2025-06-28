import { PartialType } from '@nestjs/swagger';
import { CreateRoadMapDto } from './create-road-map.dto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';

export class UpdateRoadMapDto extends PartialType(CreateRoadMapDto) {

    @ApiProperty({ example: 101, description: 'ID ของ Road Map ที่ต้องการอัปเดต' })
    @IsNumber({}, { message: 'id ต้องเป็นตัวเลข' })
    id: number;

}
