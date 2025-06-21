import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Length,
  IsNotEmpty
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePeopleUserDto } from './create-people-user.dto'

export class UpdatePeopleUserDto extends CreatePeopleUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'สถานะต้องไม่เกิน 20 ตัวอักษร' })
  status?: string;

}
