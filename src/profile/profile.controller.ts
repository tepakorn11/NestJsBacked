import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Profiles') 
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างโปรไฟล์ใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างโปรไฟล์สำเร็จ' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ทั้งหมด' })
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสโปรไฟล์' })
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตโปรไฟล์ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสโปรไฟล์' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบโปรไฟล์ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสโปรไฟล์' })
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
