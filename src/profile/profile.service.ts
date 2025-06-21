import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ✅ เพิ่มบรรทัดนี้
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import  {IProfile ,ISocial} from "../interface/profile"

import { toCamelCase } from 'utils/camel-case';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }
  private readonly logger = new Logger(ProfileService.name);


  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: number) {
    try {
      const profile = await this.prisma.user_profile.findUnique({
        where: {id},
      });

   if (!profile) {
      throw new NotFoundException(`ไม่พบผู้ใช้งาน ID ${id}`);
    }

      const socials = await this.prisma.social_list.findMany({
      where: {user_id:id}
      })

      const result:IProfile = {
        ...profile,
        socials
      };

      return result;
      
    } catch (error) {
      this.logger.error('fail to get  my profile',error.stock);
      
    }
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
