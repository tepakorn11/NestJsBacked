import { Test, TestingModule } from '@nestjs/testing';
import { RoadMapService } from './road-map.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('RoadMapService', () => {
  let service: RoadMapService;
  let prisma: PrismaService;

  const mockPrisma = {
    road_map: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadMapService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoadMapService>(RoadMapService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.road_map.create', async () => {
    const dto = { title: 'Test Roadmap', year: 2025 };
    const expected = { id: 1, ...dto };
    mockPrisma.road_map.create.mockResolvedValue(expected);

    const result = await service.create(dto as any);
    expect(result).toEqual(expected);
    expect(mockPrisma.road_map.create).toHaveBeenCalledWith({ data: dto });
  });

  it('findAll should return list of road maps', async () => {
    const items = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
    mockPrisma.road_map.findMany.mockResolvedValue(items);

    const result = await service.findAll();
    expect(result).toEqual(items);
    expect(mockPrisma.road_map.findMany).toHaveBeenCalledWith({
      orderBy: { year: 'asc' },
    });
  });

  it('findOne should return a road map if found', async () => {
    const item = { id: 1, title: 'One' };
    mockPrisma.road_map.findUnique.mockResolvedValue(item);

    const result = await service.findOne(1);
    expect(result).toEqual(item);
    expect(mockPrisma.road_map.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('findOne should throw NotFoundException if not found', async () => {
    mockPrisma.road_map.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('update should update multiple roadmaps', async () => {
    const dto = [{ id: 1, title: 'Updated' }];
    mockPrisma.road_map.update.mockResolvedValue({ id: 1, title: 'Updated' });

    const result = await service.update(1, dto as any);
    expect(mockPrisma.road_map.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto[0],
    });
    expect(result).toEqual('This action updates a #1 roadMap');
  });

  it('remove should delete a roadmap', async () => {
    const item = { id: 1, title: 'Deleted' };
    mockPrisma.road_map.delete.mockResolvedValue(item);

    const result = await service.remove(1);
    expect(result).toEqual(item);
    expect(mockPrisma.road_map.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('remove should throw NotFoundException if roadmap not found', async () => {
    mockPrisma.road_map.delete.mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(service.remove(123)).rejects.toThrow(NotFoundException);
  });
});
