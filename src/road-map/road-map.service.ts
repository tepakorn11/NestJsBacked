import { CreateRoadMapDto } from './dto/create-road-map.dto';
import { UpdateRoadMapDto } from './dto/update-road-map.dto';
import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoadMapService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RoadMapService.name);

  async create(createRoadMapDto: CreateRoadMapDto) {
    try {
      const _readData = createRoadMapDto;

      const created = await this.prisma.road_map.create({
        data: {
          ..._readData,
        },
      });
      return created;
    } catch (error) {
      this.logger.error('❌ Failed to create road map', error.stack);
      throw new InternalServerErrorException('เกิดข้อผิดพลาดในการสร้าง');
    }
  }

  async findAll() {
    try {
      const result = await this.prisma.road_map.findMany({
        orderBy: { year: 'asc' },
      });
      if (!result || result.length === 0) {
        throw new NotFoundException('ไม่พบรายการ');
      }
      return result;
    } catch (error) {
      this.logger.error('❌ Failed to find all road maps', error.stack);
      throw new InternalServerErrorException('เกิดข้อผิดพลดในการค้นหาข้อมูล');
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.prisma.road_map.findUnique({ where: { id } });

      if (!item) {
        throw new NotFoundException(`ไม่พบข้อมูลที่ ID: ${id}`);
      }

      return item;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error at findOne', error.stack);
      throw new InternalServerErrorException('เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์');
    }
  }

  async update(id: number, updateRoadMapDto: UpdateRoadMapDto[]) {
    const results: { id: number; status: string }[] = [];

    try {
      for (const dto of updateRoadMapDto) {
        if (!dto.id) continue;

        await this.prisma.road_map.update({
          where: { id: dto.id },
          data: { ...dto },
        });

        results.push({ id: dto.id, status: 'success' });
      }

      return {
        message: `อัปเดตสำเร็จ ${results.length} รายการ`,
        details: results,
      };
    } catch (error) {
      this.logger.error(
        `❌ Failed to update road map with id ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `ไม่สามารถอัปเดตแผนการพัฒนาทักษะที่มี ID: ${id}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const roadMap = await this.prisma.road_map.delete({
        where: { id: id },
      });
      if (!roadMap) {
        throw new NotFoundException(`ไม่พบแผนการพัฒนาทักษะที่มี ID: ${id}`);
      }
      return roadMap;
    } catch (error) {
      this.logger.error(
        `❌ Failed to remove road map with id ${id}`,
        error.stack,
      );
      throw new NotFoundException(`ไม่พบแผนการพัฒนาทักษะที่มี ID: ${id}`);
    }
  }
}
