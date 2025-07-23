import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(MenuService.name);

  async createMenu(createMenuDto: CreateMenuDto) {
    try {
      const _realData = createMenuDto;

      const checkLevelId = await this.prisma.menu_list.findFirst({
        where: {
          level_id: _realData.level_id,
          status: 'active',
        },
      });

      if (checkLevelId) {
        throw new BadRequestException(
          `ระดับ (${_realData.level_id}) นี้ถูกใช้งานอยู่แล้ว`,
        );
      }
      const result = await this.prisma.menu_list.create({
        data: {
          ..._realData,
        },
      });
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to create menu_list', error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('ไม่สามารถสร้างเมนูได้');
    }
  }

  async findAll(status: string) {
    try {
      if (!status || status.length === 0) {
        throw new BadRequestException('โปรด ระบุ status');
      }
      const result = await this.prisma.menu_list.findMany({
        where: { status },
      });

      if (!result || result.length === 0) {
        throw new NotFoundException('ไม่พบรายการ');
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) { 
        throw error;
      }

      throw new InternalServerErrorException('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      const maxLevel = 5;
      const { level_id } = updateMenuDto;

      const existingLevels = await this.prisma.menu_list.findMany({
        where: {
          NOT: { id },
          level_id: { not: null },
          status: 'active',
        },
        select: { level_id: true },
      });

      const usedLevels = existingLevels.map((item) => item.level_id);

      const availableLevels = Array.from(
        { length: maxLevel },
        (_, i) => i + 1,
      ).filter((lvl) => !usedLevels.includes(lvl));

      if (typeof level_id !== 'number') {
        throw new BadRequestException(
          'กรุณาระบุลำดับเมนู (level_id) ให้ถูกต้อง',
        );
      }

      if (!availableLevels.includes(level_id)) {
        throw new BadRequestException(
          `ลำดับรายการนี้ถูกใช้ไปแล้ว หรือเกิน ${maxLevel} รายการ — เหลือช่องที่ใช้ได้: ${availableLevels.join(', ')}`,
        );
      }

      const duplicated = await this.prisma.menu_list.findFirst({
        where: {
          level_id: updateMenuDto.level_id,
          NOT: { id },
          status: 'active',
        },
      });

      if (duplicated) {
        throw new BadRequestException('ลำดับรายการซ้ำกับเมนูอื่นในระบบ');
      }

      const result = await this.prisma.menu_list.update({
        where: { id },
        data: updateMenuDto,
      });

      return result;
    } catch (error) {
      this.logger.error(`❌ Failed to update menu_list id=${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new NotFoundException(`ไม่พบ ${id} ที่จะทำการลบ`);
      }
      const result = await this.prisma.menu_list.update({
        where: { id },
        data: { status: 'in-active' },
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('ไม่สามารถลบเมนูได้');
    }
  }
}
