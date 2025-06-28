import { CreateRoadMapDto } from './dto/create-road-map.dto';
import { UpdateRoadMapDto } from './dto/update-road-map.dto';
import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class RoadMapService {
  constructor(private prisma: PrismaService) { }
  private readonly logger = new Logger(CreateRoadMapDto.name);

  async create(createRoadMapDto: CreateRoadMapDto) {
    try {
      const _readData = createRoadMapDto || []

      const created = await this.prisma.road_map.create({
        data: {
          ..._readData,
          // year: new Date(_readData.year).getFullYear(),
          // title: _readData.title,
          // description: _readData.description,
          // icon: _readData.icon
        }
      })
      return created;

    } catch (error) {
      this.logger.error('❌ Failed to create road map', error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await this.prisma.road_map.findMany({
        orderBy: { year: 'asc' },
      });
      if (!result) {
        throw new NotFoundException('ไม่พบรายการ');
      }
      return (result);

    } catch (error) {
      this.logger.error('❌ Failed to find all road maps', error.stack);
      throw error;

    }
  }

  async findOne(id: number) {
    try {
      const roadMap = await this.prisma.road_map.findUnique({
        where: { id: id },
      });
      if (!roadMap) {
        throw new NotFoundException(`ไม่พบแผนการพัฒนาทักษะที่มี ID: ${id}`);
      }
      return roadMap;
    } catch (error) {
      this.logger.error(`❌ Failed to find road map with id ${id}`, error.stack);
      throw new NotFoundException(`ไม่พบแผนการพัฒนาทักษะที่มี ID: ${id}`);

    }
  }

  async update(id: number, updateRoadMapDto: UpdateRoadMapDto[]) {
    const results: { id: number; status: string }[] = [];
    this.logger.debug(updateRoadMapDto);
    try {
      for (const dto of updateRoadMapDto) {
        if (!dto.id) continue;
        const result = await this.prisma.road_map.update({
          where: { id: dto.id },
          data: {
            ...dto,
          }
        })
      }
      results.push({ id: id, status: 'success' });
    } catch (error) {
      this.logger.error(`❌ Failed to update road map with id ${id}`, error.stack);
      throw new InternalServerErrorException(`ไม่สามารถอัปเดตแผนการพัฒนาทักษะที่มี ID: ${id}`);

    }
    return `This action updates a #${id} roadMap`;
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
      this.logger.error(`❌ Failed to remove road map with id ${id}`, error.stack);
      throw new NotFoundException(`ไม่พบแผนการพัฒนาทักษะที่มี ID: ${id}`);
    }
  }
}
