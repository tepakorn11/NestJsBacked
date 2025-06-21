import { Test, TestingModule } from '@nestjs/testing';
import { PeopleUserController } from './people-user.controller';
import { PeopleUserService } from './people-user.service';

describe('PeopleUserController', () => {
  let controller: PeopleUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleUserController],
      providers: [PeopleUserService],
    }).compile();

    controller = module.get<PeopleUserController>(PeopleUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
