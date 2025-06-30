import { Module } from '@nestjs/common';
import { PeopleUserService } from './people-user.service';
import { PeopleUserController } from './people-user.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule], 
  controllers: [PeopleUserController],
  providers: [PeopleUserService],
})
export class PeopleUserModule {}
