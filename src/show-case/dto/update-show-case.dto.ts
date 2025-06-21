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

}
