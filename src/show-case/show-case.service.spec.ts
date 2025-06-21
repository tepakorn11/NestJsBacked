import { Test, TestingModule } from '@nestjs/testing';
import { ShowCaseService } from './show-case.service';

describe('ShowCaseService', () => {
  let service: ShowCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowCaseService],
    }).compile();

    service = module.get<ShowCaseService>(ShowCaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
