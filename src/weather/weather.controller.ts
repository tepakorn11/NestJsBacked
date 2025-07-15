import { Controller, Get, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) { }

  @Get()
  @ApiOperation({ summary: 'ข้อมูลสภาพอากาศปัจจุบัน' })
  @ApiQuery({ name: 'city', example: 'Bangkok', description: 'ชื่อเมือง (ภาษาอังกฤษ)' })
  @ApiResponse({
    status: 200,
    description: 'ข้อมูลสภาพอากาศ',
    schema: {
      example: {
        city: 'Bangkok',
        temperature: 30.5,
        humidity: 70,
        description: 'เมฆเป็นส่วนมาก',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'โปรดระบุชื่อเมือง (city)' })
  @ApiResponse({ status: 404, description: 'ไม่พบเมืองที่ร้องขอ' })
  async getWeather(@Query('city') city: string) {
    if (!city) {
      throw new BadRequestException('กรุณาระบุ city');
    }

    return this.weatherService.getWeather(city);
  }
}