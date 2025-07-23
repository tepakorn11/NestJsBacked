import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShowCaseService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ShowCaseService.name);

  async create(createShowCaseDto: CreateShowCaseDto) {
    try {
      const _realData = createShowCaseDto;
      if (!_realData.start_working || !_realData.end_working) {
        throw new BadRequestException('กรุณาระบุวันที่เริ่มและวันที่สิ้นสุด');
      }

      const created = await this.prisma.show_case.create({
        data: {
          ..._realData,
          start_working: parseInt(_realData.start_working),
          end_working: parseInt(_realData.end_working),
        },
      });
      return created;
    } catch (error) {
      this.logger.error('❌ Failed to create show_case', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('สร้างข้อมูลล้มเหลว');
    }
  }

  async findAll(status: string) {
    try {
      if (!status) {
        throw new BadRequestException('โปรด ระบุ status');
      }

      const result = await this.prisma.show_case.findMany({
        where: { status },
        orderBy: { start_working: 'asc' },
      });
      if (!result || result.length === 0) {
        throw new NotFoundException('ไม่พบรายการ');
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('หาข้อมูลล้มเหลว');
    }
  }

  async findOneById(user_id: number) {
    try {
      const result = await this.prisma.show_case.findMany({
        where: { user_id },
      });
      if (!result || result.length === 0) {
        throw new NotFoundException('ไม่พบรายการ');
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('หาข้อมูลล้มเหลว');
    }
  }

  async updateMany(user_id: number, updateShowCaseDto: UpdateShowCaseDto[]) {
    let updateScore = 0;
    const results: { id: number; status: string }[] = [];

    try {
      if (!updateShowCaseDto || updateShowCaseDto.length === 0) {
        throw new BadRequestException('ไม่มีข้อมูลที่ต้องการอัปเดต');
      }

      for (const dto of updateShowCaseDto) {
        const start = parseInt(dto.start_working!);
        const end = parseInt(dto.end_working!);

        if (isNaN(start) || isNaN(end)) {
          throw new BadRequestException('ปีเริ่มต้นหรือสิ้นสุดไม่ถูกต้อง');
        }
        if (!dto.id) continue;
        const result = await this.prisma.show_case.update({
          where: { id: dto.id, user_id },
          data: {
            ...dto,
            start_working: start,
            end_working: end,
          },
        });
        updateScore++;
        results.push({ id: dto.id, status: 'success' });
      }

      return {
        message: `อัปเดตสำเร็จ ${updateScore} รายการ`,
        details: results,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('เกิดข้อผิดพลาดระหว่างการอัปเดต');
    }
  }

  async remove(id: number) {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID ไม่ถูกต้อง');
      }

      const result = await this.prisma.show_case.update({
        data: { status: 'in-active' },
        where: { id },
      });
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('ไม่สามารถลบข้อมูลได้');
    }
  }
}
