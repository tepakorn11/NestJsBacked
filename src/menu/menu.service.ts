import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) { }
  private readonly logger = new Logger(MenuService.name);

  async createMenu(createMenuDto: CreateMenuDto) {
    try {
      const _realData = createMenuDto || []
      const result = await this.prisma.menu_list.create({
        data: {
          ..._realData
        }
      })
      return result
    } catch (error) {
      this.logger.error('❌ Failed to create menu_list', error.stack);

    }
  }

  async findAll(status: string) {
    try {
      const result = await this.prisma.menu_list.findMany({
        where: { status }
      })
      return result

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('ไม่พบรายการ');
      }
      throw error;
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }


  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      const maxLevel = 5;
      const { level_id } = updateMenuDto;

      const existingLevels = await this.prisma.menu_list.findMany({
        where: {
          NOT: { id },
          level_id: { not: null },
        },
        select: { level_id: true }, //ดึงเฉพาะ level_id
      });

      const usedLevels = existingLevels.map((item) => item.level_id); // หาที่ level_id ตรงกัน

      const availableLevels = Array.from({ length: maxLevel }, (_, i) => i + 1).filter(
        (lvl) => !usedLevels.includes(lvl), // สร้าง arry เปล่า maxที่ 5 ให้เริ่มต้นที่ iวนหา ที่ ไม่มีใน usedLevels
      );

      if (typeof level_id !== 'number') {
        throw new BadRequestException('กรุณาระบุลำดับเมนู (level_id) ให้ถูกต้อง');
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
      if (!id) throw new NotFoundException(`ไม่พบ ${id} ที่จะทำการลบ`)
      const result = await this.prisma.menu_list.delete({
        where: { id }
      })
      return result

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('ไม่พบรายการที่ต้องการลบ');
      }
      throw error;
    }


  }
}