import { Module } from '@nestjs/common';
import { PeopleUserService } from './people-user.service';
import { PeopleUserController } from './people-user.controller';

@Module({
  controllers: [PeopleUserController],
  providers: [PeopleUserService],
})
export class PeopleUserModule {}
