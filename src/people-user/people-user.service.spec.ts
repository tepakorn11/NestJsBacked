import { Test, TestingModule } from '@nestjs/testing';
import { PeopleUserService } from './people-user.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

describe('PeopleUserService', () => {
  let service: PeopleUserService;
  let prisma: any;
  let redis: any;

  beforeEach(async () => {
    prisma = {
      people_user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };

    redis = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleUserService,
        { provide: PrismaService, useValue: prisma },
        { provide: 'REDIS_CLIENT', useValue: redis },
      ],
    }).compile();

    service = module.get<PeopleUserService>(PeopleUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      const dto = {
        f_name: 'Test',
        l_name: 'User',
        n_name: 'TU',
        full_name: 'Test User',
        age: 25,
        rule: 1,
      };
      prisma.people_user.create.mockResolvedValue(dto);
      const result = await service.create(dto as any);
      expect(result).toEqual(dto);
      expect(prisma.people_user.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw InternalServerErrorException on error', async () => {
      prisma.people_user.create.mockRejectedValue(new Error('fail'));
      await expect(service.create({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const user = { id: 1, full_name: 'Test' };
      prisma.people_user.findUnique.mockResolvedValue(user);
      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.people_user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should rethrow other errors', async () => {
      prisma.people_user.findUnique.mockRejectedValue(new Error('DB Error'));
      await expect(service.findOne(1)).rejects.toThrow(Error);
    });
  });

  describe('update_by_user', () => {
    it('should update user', async () => {
      const dto = { f_name: 'New', age: 30 };
      prisma.people_user.update.mockResolvedValue(dto);
      const result = await service.update_by_user(1, dto as any);
      expect(result).toEqual(dto);
    });

    it('should log error if update fails', async () => {
      prisma.people_user.update.mockRejectedValue(new Error('fail'));
      const spy = jest.spyOn(console, 'error').mockImplementation();
      await service.update_by_user(1, {} as any);
      spy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      prisma.people_user.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1);
      expect(result).toEqual('This action removes a #1');
    });

    it('should log error if delete fails', async () => {
      prisma.people_user.delete.mockRejectedValue(new Error('fail'));
      const spy = jest.spyOn(console, 'error').mockImplementation();
      await service.remove(1);
      spy.mockRestore();
    });
  });

  describe('remove_by_status', () => {
    it('should update status to in-active', async () => {
      const updated = { id: 1, status: 'in-active' };
      prisma.people_user.update.mockResolvedValue(updated);
      const result = await service.remove_by_status(1);
      expect(result).toEqual(updated);
    });

    it('should log error if update fails', async () => {
      prisma.people_user.update.mockRejectedValue(new Error('fail'));
      const spy = jest.spyOn(console, 'error').mockImplementation();
      await service.remove_by_status(1);
      spy.mockRestore();
    });
  });

  describe('findAll', () => {
    const query = { type_query: '', rule: 0, status: '' };
    const mockResult = [{ user_id: 1, full_name: 'Test User' }];

    it('✅ should return from cache if exists (truthy value)', async () => {
      redis.get.mockResolvedValue(JSON.stringify(mockResult)); // ✅ cache hit
      const result = await service.findAll(query);
      expect(result).toEqual(mockResult);
      expect(redis.get).toHaveBeenCalled();
    });

    it('🟧 should skip cache if redis returns null', async () => {
      redis.get.mockResolvedValue(null); // ❌ cache miss
      prisma.$queryRaw.mockResolvedValue(mockResult);
      const result = await service.findAll(query);
      expect(result).toEqual(mockResult);
      expect(redis.set).toHaveBeenCalled();
    });

    it('🟧 should skip cache if redis returns empty string ""', async () => {
      redis.get.mockResolvedValue(''); // falsy value แต่ไม่ใช่ null
      prisma.$queryRaw.mockResolvedValue(mockResult);
      const result = await service.findAll(query);
      expect(result).toEqual(mockResult);
    });

    it('🟧 should skip cache if redis returns undefined', async () => {
      redis.get.mockResolvedValue(undefined); // อีกหนึ่งกรณี falsy
      prisma.$queryRaw.mockResolvedValue(mockResult);
      const result = await service.findAll(query);
      expect(result).toEqual(mockResult);
    });

    it('🟧 should skip cache if redis returns false', async () => {
      redis.get.mockResolvedValue(false as any); // falsy ที่ต่างจาก null/undefined
      prisma.$queryRaw.mockResolvedValue(mockResult);
      const result = await service.findAll(query);
      expect(result).toEqual(mockResult);
    });

    it('❌ should throw InternalServerErrorException if redis.get fails', async () => {
      redis.get.mockRejectedValue(new Error('fail')); // error ใน redis
      await expect(service.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
