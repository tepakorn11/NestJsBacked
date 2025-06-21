// src/app.module.ts
import { Module }        from '@nestjs/common';
import { AppController } from './app.controller';
import { PeopleUserModule } from './people-user/people-user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ShowCaseModule } from './show-case/show-case.module';
import { MenuModule } from './menu/menu.module';
import { AppService }    from './app.service';

@Module({
  controllers:[AppController],
  providers:  [AppService, PrismaService],
  imports: [PeopleUserModule, PrismaModule, ProfileModule, ShowCaseModule, MenuModule],
})
export class AppModule {}
