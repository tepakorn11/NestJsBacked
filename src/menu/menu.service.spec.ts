import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client'; // เพิ่มเฉพาะสำหรับ PrismaClientKnownRequestError
describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  const mockPrismaService = {
    menu_list: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMenu', () => {
    it('should create a menu successfully', async () => {
      const dto = { name: 'Menu A', status: 'active' };
      mockPrismaService.menu_list.create.mockResolvedValue(dto);

      const result = await service.createMenu(dto as any);
      expect(result).toEqual(dto);
      expect(prisma.menu_list.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw error when creation fails', async () => {
      mockPrismaService.menu_list.create.mockRejectedValue(
        new Error('DB error'),
      );
      await expect(service.createMenu({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return list of menus', async () => {
      const menus = [{ id: 1, name: 'A', status: 'active' }];
      mockPrismaService.menu_list.findMany.mockResolvedValue(menus);

      const result = await service.findAll('active');
      expect(result).toEqual(menus);
      expect(prisma.menu_list.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });

    it('should throw error on findAll failure', async () => {
      mockPrismaService.menu_list.findMany.mockRejectedValue(
        new Error('Find failed'),
      );
      await expect(service.findAll('active')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw NotFoundException if result is empty', async () => {
      mockPrismaService.menu_list.findMany.mockResolvedValue([]);
      await expect(service.findAll('active')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update menu successfully', async () => {
      const updated = { id: 1, name: 'Updated', level_id: 2 };
      mockPrismaService.menu_list.count.mockResolvedValue(3);
      mockPrismaService.menu_list.update.mockResolvedValue(updated);

      const result = await service.update(1, updated as any);
      expect(result).toEqual(updated);
    });

    it('should throw BadRequestException if level_id > 5', async () => {
      mockPrismaService.menu_list.count.mockResolvedValue(5);
      await expect(service.update(1, { level_id: 2 } as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      mockPrismaService.menu_list.count.mockResolvedValue(3);
      mockPrismaService.menu_list.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.update(1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw BadRequestException if level_id is not in availableLevels', async () => {
      mockPrismaService.menu_list.count.mockResolvedValue(5);
      const dto = { level_id: 6 };

      await expect(service.update(1, dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if level_id is duplicated', async () => {
      const dto = { level_id: 2 };

      mockPrismaService.menu_list.count.mockResolvedValue(3);
      mockPrismaService.menu_list.findFirst.mockResolvedValue({ id: 99 });
      mockPrismaService.menu_list.findMany.mockResolvedValue([
        { level_id: 1 },
        { level_id: 3 },
      ]);

      await expect(service.update(1, dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      const removed = { id: 1, name: 'A' };
      mockPrismaService.menu_list.delete.mockResolvedValue(removed);
      const result = await service.remove(1);
      expect(result).toEqual(removed);
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      mockPrismaService.menu_list.delete.mockRejectedValue(
        new Error('Delete failed'),
      );
      await expect(service.remove(999)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
