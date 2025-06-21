import { Test, TestingModule } from '@nestjs/testing';
import { PeopleUserService } from './people-user.service';

describe('PeopleUserService', () => {
  let service: PeopleUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleUserService],
    }).compile();

    service = module.get<PeopleUserService>(PeopleUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
