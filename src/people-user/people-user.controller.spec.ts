import { Test, TestingModule } from '@nestjs/testing';
import { PeopleUserController } from './people-user.controller';
import { PeopleUserService } from './people-user.service';
import { CreatePeopleUserDto } from './dto/create-people-user.dto';
import { UpdatePeopleUserDto } from './dto/update-people-user.dto';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';

describe('PeopleUserController', () => {
  let controller: PeopleUserController;
  let service: PeopleUserService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update_by_user: jest.fn(),
    remove_by_status: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleUserController],
      providers: [{ provide: PeopleUserService, useValue: mockService }],
    }).compile();

    controller = module.get<PeopleUserController>(PeopleUserController);
    service = module.get<PeopleUserService>(PeopleUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreatePeopleUserDto = {
        age: 30,
        f_name: 'John',
        l_name: 'Doe',
        n_name: 'JD',
        full_name: 'John Doe',
        rule: 1,
        total_subject: 0,
      };

      mockService.create.mockResolvedValue(dto);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('find_all', () => {
    it('should call service.findAll and return result', async () => {
      const query: FindAllUserQueryDto = { type_query: '', rule: 0, status: '' };
      const expected = [{ id: 1, full_name: 'Test' }];

      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.find_all(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with number id', async () => {
      const user = { id: 1, full_name: 'Johnny' };
      mockService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('updateByUser', () => {
    it('should call service.update_by_user with number id', async () => {
      const dto: UpdatePeopleUserDto = {
        f_name: 'Jane',
        age: 33,
      };

      const updated = { id: 1, ...dto };
      mockService.update_by_user.mockResolvedValue(updated);

      const result = await controller.updateByUser('1', dto);
      expect(service.update_by_user).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('removeByStatus', () => {
    it('should call service.remove_by_status with number id', async () => {
      const mockResult = { id: 1, status: 'in-active' };
      mockService.remove_by_status.mockResolvedValue(mockResult);

      const result = await controller.removeByStatus('1');
      expect(service.remove_by_status).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with number id', async () => {
      const resultMsg = 'This action removes a #1';
      mockService.remove.mockResolvedValue(resultMsg);

      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(resultMsg);
    });
  });
});
