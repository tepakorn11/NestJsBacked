import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PeopleUserService } from './people-user.service';
import { CreatePeopleUserDto } from './dto/create-people-user.dto';
import { UpdatePeopleUserDto } from './dto/update-people-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { run } from 'node:test';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';
@Controller('people-user')
@ApiTags('People User')
export class PeopleUserController {
  constructor(private readonly peopleUserService: PeopleUserService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างผู้ใช้ใหม่' })
  @ApiBody({
    type: CreatePeopleUserDto,
    description: 'ข้อมูลผู้ใช้ใหม่',
    examples: {
      'Create People User': {
        summary: 'ตัวอย่างการสร้างผู้ใช้ใหม่',
        value: {
          age: 55,
          f_name: 'Jonathan',
          l_name: 'Doe',
          n_name: 'Johnny',
          full_name: 'Jonathan Doe',
          rule: 1,
          total_subject: 0,
        },
      },
    },
  })
  create(@Body() createPeopleUserDto: CreatePeopleUserDto) {
    return this.peopleUserService.create(createPeopleUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลผู้ใช้ทั้งหมด' })
  find_all(@Query() query: FindAllUserQueryDto) {
    return this.peopleUserService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลผู้ใช้ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสผู้ใช้' })
  findOne(@Param('id') id: string) {
    return this.peopleUserService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตผู้ใช้ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสผู้ใช้' })
  @ApiBody({
    type: CreatePeopleUserDto,
    description: 'ข้อมุลที่ต้องการอัปเดต',
    examples: {
      'Update People User': {
        summary: 'ตัวอย่างการอัปเดตผู้ใช้',
        value: {
          age: 30,
          f_name: 'John',
          l_name: 'Smith',
          n_name: 'Johnny',
          full_name: 'John Smith',
          rule: 2,
          total_subject: 5,
          status: 'active',
        },
      },
      'test update by status': {
        summary: 'ตัวอย่างอัปเดตผู้ใช้โดยสถานะ',
        value: {
          status: 'inactive',
        },
      },
    },
  })
  updateByUser(
    @Param('id') id: string,
    @Body() updatePeopleUserDto: UpdatePeopleUserDto,
  ) {
    return this.peopleUserService.update_by_user(+id, updatePeopleUserDto);
  }

  @Patch('by_status/:id')
  @ApiOperation({ summary: 'อัปเดตผู้ใช้ตามสถานะ' })
  @ApiParam({ name: 'id', description: 'รหัสผู้ใช้' })
  removeByStatus(@Param('id') id: string) {
    return this.peopleUserService.remove_by_status(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบผู้ใช้ตาม ID' })
  @ApiParam({ name: 'id', description: 'รหัสผู้ใช้' })
  remove(@Param('id') id: string) {
    return this.peopleUserService.remove(+id);
  }
}
