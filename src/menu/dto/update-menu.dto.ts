import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';
export class UpdateMenuDto extends PartialType(CreateMenuDto) {

    @ApiProperty({ example: 1 , description:'รายการที่จะทำการ update'})
    @IsNumber({},{message: 'ตัวเลขเท่านั้น'})
    id:number

    @ApiProperty({ example: 'in-active' , description: 'สถานะของเมนู'})
    status:string

}
