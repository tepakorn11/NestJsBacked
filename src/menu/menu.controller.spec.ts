import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockMenuService = {
    createMenu: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call menuService.createMenu with correct data', async () => {
      const dto: CreateMenuDto = { level_id: 1, name: 'Test' };
      mockMenuService.createMenu.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(service.createMenu).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should call menuService.findAll with status query', async () => {
      const status = 'active';
      mockMenuService.findAll.mockResolvedValue([{ id: 1, name: 'Menu1' }]);

      const result = await controller.findAll(status);
      expect(service.findAll).toHaveBeenCalledWith(status);
      expect(result).toEqual([{ id: 1, name: 'Menu1' }]);
    });
  });

  describe('update', () => {
    it('should call menuService.update with id and dto', async () => {
      const id = '1';
      const dto: UpdateMenuDto = { level_id: 2, name: 'Updated', status: 'active' };
      mockMenuService.update.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto); 
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('remove', () => {
    it('should call menuService.remove with id', async () => {
      mockMenuService.remove.mockResolvedValue({ id: 1, name: 'Deleted' });

      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'Deleted' });
    });
  });
});
