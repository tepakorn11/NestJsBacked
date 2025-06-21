import { Module } from '@nestjs/common';
import { ShowCaseService } from './show-case.service';
import { ShowCaseController } from './show-case.controller';

@Module({
  controllers: [ShowCaseController],
  providers: [ShowCaseService],
})
export class ShowCaseModule {}
