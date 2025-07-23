
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllUserQueryDto {
  @ApiPropertyOptional({ description: 'ประเภทการค้นหา', example: 'rule' })
  @IsOptional()
  @IsString()
  type_query?: string;

  @ApiPropertyOptional({ description: 'รหัส rule', example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  rule?: number;

  @ApiPropertyOptional({ description: 'สถานะของผู้ใช้ เช่น active/inactive', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
