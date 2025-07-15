// src/app.module.ts
import { Module }        from '@nestjs/common';
import { AppController } from './app.controller';
import { PeopleUserModule } from './people-user/people-user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ShowCaseModule } from './show-case/show-case.module';
import { MenuModule } from './menu/menu.module';
import { RoadMapModule } from './road-map/road-map.module';
import { AppService }    from './app.service';
import { RedisModule } from './redis/redis.module'; 
import { WeatherModule } from './weather/weather.module';

@Module({
  controllers:[AppController],
  providers:  [AppService, PrismaService],
  imports: [PeopleUserModule, PrismaModule, ProfileModule, ShowCaseModule, MenuModule, RoadMapModule ,RedisModule ,WeatherModule],
})
export class AppModule {}
