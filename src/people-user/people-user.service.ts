import { CreatePeopleUserDto } from './dto/create-people-user.dto';
import { UpdatePeopleUserDto } from './dto/update-people-user.dto';
import { PrismaService } from '../prisma/prisma.service'; // ✅ เพิ่มบรรทัดนี้
import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { toCamelCase } from 'utils/camel-case';
import { findAllUser } from '../interface/people-user'
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
@Injectable()
export class PeopleUserService {
  constructor(private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,

  ) { }
  private readonly logger = new Logger(PeopleUserService.name);

  async create(createPeopleUserDto: CreatePeopleUserDto) {
    try {
      const _realData = createPeopleUserDto || []

      const created = await this.prisma.people_user.create({
        data: {
          age: _realData.age,
          f_name: _realData.f_name,
          l_name: _realData.l_name,
          n_name: _realData.n_name,
          full_name: _realData.full_name,
          rule: _realData.rule,
        },

      });

      return created;

    } catch (error) {
      this.logger.error('❌ Failed to create people_user', error.stack);
    }

  }


  async findAll(query: { type_query: string, rule: number, status: string }) {
    try {
      const { type_query = '', rule = 0, status = '' } = query;
      const safeStatus = String(status ?? '');
      const safeRule = Number(rule ?? 0);

      const cacheKey = `people_user:all:type=${type_query}:rule=${safeRule}:status=${safeStatus}`;

      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.log(`✅ Return people_user from cache`);
        return JSON.parse(cached);
      }

      const result = await this.prisma.$queryRaw<findAllUser[]>`
      Select t1.id as user_id,
            f_name,
            l_name,
            n_name,
            full_name,
            age,
            rule_name,
            total_subject,
            t1.status
      From people_user t1 
      Left Join rule_list t2 On t1.rule = t2.id
      Where (${safeStatus} = '' OR t1.status = ${safeStatus})
      And (${safeRule} = 0 Or t1.rule = ${safeRule})
    `;

      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300);

      return result;
    } catch (error) {
      this.logger.error('Failed to find people_user', error.stack);
      throw error;
    }
  }



  async findOne(id: number) {
    try {
      const result = await this.prisma.people_user.findUnique({
        where: { id },
      });

      if (!result) {
        throw new NotFoundException(`ไม่พบข้อมูลของผู้ใช้เลขที่ Id = ${id}`)
      }
      return (result);
    } catch (error) {
      this.logger.error('Failed to find people_user', error.stack)
      throw error;

    }

  }

  async update_by_user(id: number, updatePeopleUserDto: UpdatePeopleUserDto) {
    try {
      const _realData = updatePeopleUserDto || []
      const updated = await this.prisma.people_user.update({
        where: {
          id,
        },
        data: {
          f_name: _realData.f_name,
          l_name: _realData.l_name,
          status: _realData.status,
          update_at: new Date(),
          full_name: _realData.full_name,
          n_name: _realData.n_name,
          age: _realData.age

        },
      });
      return (updated);

    } catch (error) {
      this.logger.error('Failed to find people_user', error.stack)


    }
  }

  async remove(id: number) {
    try {
      await this.prisma.people_user.delete({
        where: { id }
      })
      return `This action removes a #${id}`;

    } catch (error) {
      this.logger.error('Failed to find people_user', error.stack)

    }
  }

  async remove_by_status(id: number) {

    try {
      const _updateStatus = await this.prisma.people_user.update({
        where: {
          id,
        },
        data: {
          status: 'in-active'
        }

      })

      return (_updateStatus)

    } catch (error) {
      this.logger.error('failed to update status', error.stack)

    }
  }
}
