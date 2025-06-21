import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ShowCaseService {
  constructor(private prisma: PrismaService) { }
  private readonly logger = new Logger(ShowCaseService.name);

  async create(createShowCaseDto: CreateShowCaseDto) {
    try {
      const _realData = createShowCaseDto || []

      const created = await this.prisma.show_case.create({
        data: {
          ..._realData
        }
      })
      return created;
    } catch (error) {
      this.logger.error('❌ Failed to create show_case', error.stack);

    }
  }

  async findAll() {
    try {
      const result = await this.prisma.show_case.findMany({
      });
      if (!result) {
        throw new NotFoundException('ไม่พบรายการ');
      }
      return (result)
    } catch (error) {
      this.logger.error('❌ Failed to find all show cases', error.stack);
      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      const user_id = id
      const result = await this.prisma.show_case.findMany({
        where: { user_id }
      })
      if (!result) {
        throw new NotFoundException('ไม่พบรายการ')
      }
      return (result)
    } catch (error) {
      this.logger.error('❌ Failed to find all show cases', error.stack);
      throw error;
    }
  }

  async updateMany(user_id: number, updateShowCaseDto: UpdateShowCaseDto[]) {
    this.logger.debug(updateShowCaseDto)

    let updateScore = 0
    const results: { id: number; status: string }[] = [];

    try {
      for (const dto of updateShowCaseDto) {
        if (!dto.id) continue;
        const result = await this.prisma.show_case.update({
          where: { id: dto.id, user_id },
          data: {
            ...dto
          }
        });
        updateScore++;
        results.push({ id: dto.id, status: 'success' });
      }
      return {
        message: `อัปเดตสำเร็จ ${updateScore} รายการ`,
        details: results,
      };
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดระหว่างการอัปเดต', error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      if (!id) return new NotFoundException('ไม่พบรายการ')
      const result = await this.prisma.show_case.delete({
        where: { id }
      })
      return result
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดในการลบ', error.stack)

    }

  }
}
