import { Test, TestingModule } from '@nestjs/testing';
import { ShowCaseController } from './show-case.controller';
import { ShowCaseService } from './show-case.service';

describe('ShowCaseController', () => {
  let controller: ShowCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowCaseController],
      providers: [ShowCaseService],
    }).compile();

    controller = module.get<ShowCaseController>(ShowCaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
