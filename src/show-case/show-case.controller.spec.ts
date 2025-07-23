import { Test, TestingModule } from '@nestjs/testing';
import { ShowCaseController } from './show-case.controller';
import { ShowCaseService } from './show-case.service';
import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import { BadRequestException } from '@nestjs/common';

describe('ShowCaseController', () => {
  let controller: ShowCaseController;

  const mockShowCaseService = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findAll: jest.fn().mockResolvedValue([{ id: 1 }]),
    findOneById: jest.fn().mockResolvedValue({ id: 1 }),
    updateMany: jest.fn().mockResolvedValue({ message: 'updated' }),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowCaseController],
      providers: [
        {
          provide: ShowCaseService,
          useValue: mockShowCaseService,
        },
      ],
    }).compile();

    controller = module.get<ShowCaseController>(ShowCaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a show case', async () => {
    const dto: CreateShowCaseDto = {
      user_id: 1,
      business_name: 'บริษัท A',
      description: 'ทำระบบ',
      salary: 30000,
      start_working: '2565',
      end_working: '2566',
      status: 'active',
      icon: 'mdi:icon',
    };
    const result = await controller.create(dto);
    expect(mockShowCaseService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1 });
  });

  it('should return all show cases', async () => {
    const result = await controller.findAll('active');
    expect(mockShowCaseService.findAll).toHaveBeenCalledWith('active');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should return show case by id', async () => {
    const result = await controller.findOneById('5');
    expect(mockShowCaseService.findOneById).toHaveBeenCalledWith(5);
    expect(result).toEqual({ id: 1 });
  });

  it('should update many show cases', async () => {
    const updateDtos: UpdateShowCaseDto[] = [
      {
        id: 1,
        start_working: '2560',
        end_working: '2563',
        status: 'active',
      },
    ];
    const result = await controller.update('1', updateDtos);
    expect(mockShowCaseService.updateMany).toHaveBeenCalledWith(1, updateDtos);
    expect(result).toEqual({ message: 'updated' });
  });

  it('should skip update if dto.id is missing', async () => {
    const updateDtos: UpdateShowCaseDto[] = [
      {
        start_working: '2565',
        end_working: '2566',
        status: 'active',
      } as any,
    ];
    const result = await controller.update('1', updateDtos);
    expect(mockShowCaseService.updateMany).toHaveBeenCalledWith(1, updateDtos);
    expect(result).toEqual({ message: 'updated' });
  });

  it('should throw if year is invalid', async () => {
    const updateDtos: UpdateShowCaseDto[] = [
      {
        id: 1,
        start_working: 'abcd', // invalid
        end_working: '2566',
      } as any,
    ];

    mockShowCaseService.updateMany = jest.fn(() => {
      throw new BadRequestException('ปีเริ่มต้นหรือสิ้นสุดไม่ถูกต้อง');
    });

    await expect(controller.update('1', updateDtos)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should remove a show case', async () => {
    const result = await controller.remove('9');
    expect(mockShowCaseService.remove).toHaveBeenCalledWith(9);
    expect(result).toEqual({ id: 1 });
  });
});
