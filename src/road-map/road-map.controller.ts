import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoadMapService } from './road-map.service';
import { CreateRoadMapDto } from './dto/create-road-map.dto';
import { UpdateRoadMapDto } from './dto/update-road-map.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';


@Controller('road-map')
@ApiTags('Road Map')
export class RoadMapController {
  constructor(private readonly roadMapService: RoadMapService) { }

  @Post()
  @ApiOperation({ summary: 'สร้างแผนการพัฒนาทักษะใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างแผนการพัฒนาทักษะสำเร็จ' })
  @ApiResponse({ status: 500, description: 'ผิดพลาดจาก Server' })
  @ApiBody({
    type: CreateRoadMapDto,
    description: 'แผนการพัฒนาทักษะใหม่',
    examples: {
      'Create New Road Map': {
        value: {
          year: 2023,
          title: 'การพัฒนาเว็บแอปพลิเคชัน',
          description: 'การพัฒนาเว็บแอปพลิเคชันที่ใช้เทคโนโลยีล่าสุด',
          icon: 'mdi:robot'
        }
      }
    }
  })
  create(@Body() createRoadMapDto: CreateRoadMapDto) {
    return this.roadMapService.create(createRoadMapDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงแผนการพัฒนาทักษะทั้งหมด' })
  findAll() {
    return this.roadMapService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงแผนการพัฒนาทักษะตาม ID' })
  findOne(@Param('id') id: string) {
    return this.roadMapService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตแผนการพัฒนาทักษะตาม ID' })
  @ApiBody({
    type: UpdateRoadMapDto,
    description: 'อัปเดตแผนการพัฒนาทักษะ',
    examples: {
      'Update Road Map': {
        summary: 'อัปเดตแผนการพัฒนาทักษะ',
        value: [
          {
            id: 1,
            year: 2024,
            title: 'การพัฒนาเว็บแอปพลิเคชันขั้นสูง',
            description: 'การพัฒนาเว็บแอปพลิเคชันที่ใช้เทคโนโลยีล่าสุดและเครื่องมือใหม่ๆ',
            icon: 'mdi:web'
          },
          {
            id: 2,
            year: 2025,
            title: 'การพัฒนาแอปพลิเคชันมือถือ',
            description: 'การพัฒนาแอปพลิเคชันมือถือที่ใช้เทคโนโลยีล่าสุด',
            icon: 'mdi:cellphone'
          }
        ]
      }
    }
  })

  update(@Param('id') id: string, @Body() updateRoadMapDto: UpdateRoadMapDto[]) {
    return this.roadMapService.update(+id, updateRoadMapDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบแผนการพัฒนาทักษะตาม ID' })
  remove(@Param('id') id: string) {
    return this.roadMapService.remove(+id);
  }
}
