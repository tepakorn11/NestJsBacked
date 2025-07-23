import { Test, TestingModule } from '@nestjs/testing';
import { RoadMapController } from './road-map.controller';
import { RoadMapService } from './road-map.service';

describe('RoadMapController', () => {
  let controller: RoadMapController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoadMapController],
      providers: [
        {
          provide: RoadMapService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RoadMapController>(RoadMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = {
      year: 2023,
      title: 'test',
      description: 'test desc',
      icon: 'mdi:test',
    };
    await controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne', async () => {
    await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update', async () => {
    const dto = [
      {
        id: 1,
        year: 2023,
        title: 'update',
        description: '...',
        icon: 'mdi:robot',
      },
    ];
    await controller.update('1', dto as any);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove', async () => {
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
