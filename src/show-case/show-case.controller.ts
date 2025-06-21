import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShowCaseService } from './show-case.service';
import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';

@Controller('show-case')
@ApiTags('Show Case')
export class ShowCaseController {
  constructor(private readonly showCaseService: ShowCaseService) { }

  @Post()
  @ApiOperation({ summary: 'สร้างรายการประสบการณ์การทำงาน'})
  @ApiResponse({status:201 , description: 'สร้างรายการสำเร็จ'})
  @ApiResponse({status:500 , description: 'ผิดพลาดจาก Server'})
  @ApiBody({type:CreateShowCaseDto,
    description:'รายการประสบการณ์การทำงานใหม่',
    examples:{
      'Create New List': {
        value: {
          user_id:1,
          year:2057,
          title:'เรื่องของเรา',
          description:'เรื่องของเรากับเธอกับฉัน',
          icon:'mdi:robot'
        }
      }
    }
  })
  create(@Body() createShowCaseDto: CreateShowCaseDto) {
    return this.showCaseService.create(createShowCaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงประสบการณ์การทำงานทั้งหมด' })
  findAll() {
    return this.showCaseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงประสกการณ์การทำงานตาม ID' })
  findOneById(@Param('id') id: string) {
    return this.showCaseService.findOneById(+id); // string ได้เพราะ +id = แปลงเป็น int ให้
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update ทีละหลายๆ รายการ'})
    @ApiBody({
    type: CreateShowCaseDto,
    description: 'อัพเดทข้อมูลที่ละหลายๆการการ',
    examples: {
      'Get ....x': {
        summary: 'ดึงข้อมูล ประสบการณ์การทำงาน',
        value: [
          {
          id:1,
          user_id: 1,
          year: 2025,
          title: 'ขายกบออนไล',
          description: 'อะไรก็ได้ใส่ไปถอะ',
          icon: 'mdi:robot'
        },
        {
          id:2,
          user_id: 1,
          year: 2024,
          title: 'เศร้า',
          description: 'เศร้ามากโดนยืมแงแง',
          icon: 'mdi:robot'
        },
      ]
      }
    }
  })
  update(@Param('id') user_id: string, @Body() updateShowCaseDto: UpdateShowCaseDto[]) {
    return this.showCaseService.updateMany(+user_id, updateShowCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบทีละรายการ' })
  remove(@Param('id') id: string) {
    return this.showCaseService.remove(+id);
  }
}
