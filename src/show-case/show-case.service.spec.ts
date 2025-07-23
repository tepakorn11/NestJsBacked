
import { Test, TestingModule } from '@nestjs/testing';
import { ShowCaseService } from './show-case.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ShowCaseService', () => {
  let service: ShowCaseService;
  let prisma: PrismaService;

  const mockPrisma = {
    show_case: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      update: jest.fn().mockResolvedValue({ id: 1 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowCaseService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ShowCaseService>(ShowCaseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a show case', async () => {
      const dto: any = {
        user_id: 1,
        start_working: '2024',
        end_working: '2024',
      };

      const result = await service.create(dto);
      expect(prisma.show_case.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should throw BadRequestException if start or end missing', async () => {
      await expect(service.create({ user_id: 1, start_working: '', end_working: '' } as any))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all show cases', async () => {
      const result = await service.findAll('active');
      expect(prisma.show_case.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
        orderBy: { start_working: 'asc' },
      });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should throw BadRequestException if no status', async () => {
      await expect(service.findAll(undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if no result', async () => {
      mockPrisma.show_case.findMany.mockResolvedValueOnce([]);
      await expect(service.findAll('inactive')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return show cases by user_id', async () => {
      const result = await service.findOneById(1);
      expect(prisma.show_case.findMany).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.show_case.findMany.mockResolvedValueOnce([]);
      await expect(service.findOneById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMany', () => {
    it('should update multiple records', async () => {
      const dto = [
        { id: 1, user_id: 1, start_working: '2024', end_working: '2024' },
        { id: 2, user_id: 1, start_working: '2024', end_working: '2024' },
      ];
      const result = await service.updateMany(1, dto);
      expect(prisma.show_case.update).toHaveBeenCalledTimes(2);
      expect(result.message).toContain('อัปเดตสำเร็จ');
    });

    it('should skip record without id', async () => {
      const dto = [{ user_id: 1, start_working: '2024', end_working: '2024' }];
      const result = await service.updateMany(1, dto as any);
      expect(prisma.show_case.update).toHaveBeenCalledTimes(0);
      expect(result.details.length).toBe(0);
    });

    it('should throw BadRequestException for invalid year', async () => {
      const dto = [{ id: 1, start_working: 'xxxx', end_working: '2024' }];
      await expect(service.updateMany(1, dto as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty input', async () => {
      await expect(service.updateMany(1, [])).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should mark show case as in-active', async () => {
      const result = await service.remove(1);
      expect(prisma.show_case.update).toHaveBeenCalledWith({
        data: { status: 'in-active' },
        where: { id: 1 },
      });
      expect(result).toEqual({ id: 1 });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.remove(NaN)).rejects.toThrow(BadRequestException);
      await expect(service.remove('abc' as any)).rejects.toThrow(BadRequestException);
    });
  });
});
