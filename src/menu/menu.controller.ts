import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('menu')
@ApiTags('Menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างเมนู' })
  @ApiResponse({ status: 201, description: 'สร้างเมนูสำเร็จ' })
  @ApiResponse({ status: 500, description: 'ผิดพลาดจาก server' })
  @ApiBody({
    type: CreateMenuDto,
    description: 'สร้างรายเมนู',
    examples: {
      'Create Menu': {
        value: {
          level_id: 1,
          name: 'MyShop',
          status: 'active',

        },
      },
    },
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อเมนู' })
  @ApiResponse({ status: 200, description: 'พบรายการ' })
  @ApiResponse({ status: 500, description: 'มีข้อผิดพลาดบางอย่า' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'สถานะเมนู เช่น active, in-active',
  })
  findAll(@Query('status') status: string) {
    return this.menuService.findAll(status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัพเดทเมนู' })
  @ApiResponse({ status: 200, description: 'update รายการเมนูสำเร็จ' })
  @ApiResponse({ status: 500, description: 'เกิดข้อผิดพลาดบางอย่าง' })
  @ApiBody({
    description: 'อัพเดทเมนู',
    examples: {
      'Update Menu': {
        value: {
          id: 1,
          level_id: 2,
          name: 'Account',
          status: 'active',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบทีละรายการ' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID ของเมนู' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
