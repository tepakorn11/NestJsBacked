import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ShowCaseService } from './show-case.service';
import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BuddhistDatePipe } from 'src/common/pipes/buddhist-date.pipe';

@Controller('show-case')
@ApiTags('Show Case')
export class ShowCaseController {
  constructor(private readonly showCaseService: ShowCaseService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างรายการประสบการณ์การทำงาน' })
  @ApiResponse({ status: 201, description: 'สร้างรายการสำเร็จ' })
  @ApiResponse({ status: 500, description: 'ผิดพลาดจาก Server' })
  @UsePipes(BuddhistDatePipe)
  @ApiBody({
    type: CreateShowCaseDto,
    description: 'รายการประสบการณ์การทำงานใหม่',
    examples: {
      'Create New List': {
        value: {
          start_working: 2559,
          business_name: 'บริษัท บลูจินี่ จำกัด',
          description: 'ออกแบบสื่อสิ่งพิมพ์โดยใช้ Photoshop และ Illustrator',
          salary: 3000,
          end_working: 2559,
          status: 'active',
          icon: 'mdi:robot',
        },
      },
    },
  })
  create(@Body() createShowCaseDto: CreateShowCaseDto) {
    return this.showCaseService.create(createShowCaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงประสบการณ์การทำงานทั้งหมด' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'สถานะเมนู เช่น active, in-active',
    example: 'active',
  })
  findAll(@Query('status') status: string) {
    return this.showCaseService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงประสกการณ์การทำงานตาม ID' })
  findOneById(@Param('id') id: string) {
    return this.showCaseService.findOneById(+id); // string ได้เพราะ +id = แปลงเป็น int ให้
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update ทีละหลายๆ รายการ' })
  @ApiBody({
    type: CreateShowCaseDto,
    description: 'อัพเดทข้อมูลที่ละหลายๆการการ',
    examples: {
      'Get ....x': {
        summary: 'ดึงข้อมูล ประสบการณ์การทำงาน',
        value: [
          {
            id: 1,
            user_id: 1,
            year: 2025,
            title: 'ขายกบออนไล',
            description: 'อะไรก็ได้ใส่ไปถอะ',
            icon: 'mdi:robot',
          },
          {
            id: 2,
            user_id: 1,
            year: 2024,
            title: 'เศร้า',
            description: 'เศร้ามากโดนยืมแงแง',
            icon: 'mdi:robot',
          },
        ],
      },
    },
  })
  update(
    @Param('id') user_id: string,
    @Body() updateShowCaseDto: UpdateShowCaseDto[],
  ) {
    return this.showCaseService.updateMany(+user_id, updateShowCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบทีละรายการ' })
  remove(@Param('id') id: string) {
    return this.showCaseService.remove(+id);
  }
}
