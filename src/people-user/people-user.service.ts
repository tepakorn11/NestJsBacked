import { CreatePeopleUserDto } from './dto/create-people-user.dto';
import { UpdatePeopleUserDto } from './dto/update-people-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { toCamelCase } from 'utils/camel-case';
import { findAllUser } from '../interface/people-user';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';

@Injectable()
export class PeopleUserService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}
  private readonly logger = new Logger(PeopleUserService.name);

  async create(createPeopleUserDto: CreatePeopleUserDto) {
    try {
      const data = createPeopleUserDto;
      return await this.prisma.people_user.create({ data });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('เกิดข้อผิดพลาดในการสร้างผู้ใช้');
    }
  }

  async findAll(query: FindAllUserQueryDto) {
    try {
      const { type_query = '', rule = 0, status = '' } = query;
      const cacheKey = `people_user:all:type=${type_query}:rule=${rule}:status=${status}`;

      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.log('✅ Return people_user from cache');
        return JSON.parse(cached);
      }

      const result = await this.prisma.$queryRaw<findAllUser[]>`
        SELECT t1.id as user_id, f_name, l_name, n_name, full_name, age, rule_name, total_subject, t1.status
        FROM people_user t1 
        LEFT JOIN rule_list t2 ON t1.rule = t2.id
        WHERE (${status} = '' OR t1.status = ${status})
        AND (${rule} = 0 OR t1.rule = ${rule})
      `;

      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
      return result;
    } catch (error) {
      // this.logger.error('❌ Failed to find people_user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      );
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.prisma.people_user.findUnique({
        where: { id },
      });
      if (!result) {
        throw new NotFoundException(`ไม่พบข้อมูลของผู้ใช้เลขที่ ID = ${id}`);
      }
      return result;
    } catch (error) {
      // this.logger.error('❌ Failed to find people_user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  }

  async update_by_user(id: number, updatePeopleUserDto: UpdatePeopleUserDto) {
    try {
      return await this.prisma.people_user.update({
        where: { id },
        data: {
          ...updatePeopleUserDto,
          update_at: new Date(),
        },
      });
    } catch (error) {
      // this.logger.error('❌ Failed to update people_user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.people_user.delete({ where: { id } });
    } catch (error) {
      // this.logger.error('❌ Failed to delete people_user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('เกิดข้อผิดพลาดในการลบผู้ใช้');
    }
  }

  async remove_by_status(id: number) {
    try {
      return await this.prisma.people_user.update({
        where: { id },
        data: { status: 'in-active' },
      });
    } catch (error) {
      // this.logger.error('❌ Failed to set in-active status', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'เกิดข้อผิดพลาดในการอัปเดตสถานะผู้ใช้',
      );
    }
  }
}
