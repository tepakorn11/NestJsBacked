// create-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'ชื่อผู้ใช้งาน' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'อีเมลผู้ใช้งาน' })
  email: string;

  @ApiProperty({ example: 25, description: 'อายุผู้ใช้งาน' })
  age: number;
}
