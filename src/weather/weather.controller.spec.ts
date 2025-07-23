import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { BadRequestException } from '@nestjs/common';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  // ✅ mock data จำลองที่ให้ผลลัพธ์เหมือน WeatherService
  const mockWeatherResponse = {
    city: 'Bangkok',
    country: 'TH',
    temperature: '30 °C',
    feels_like: '32 °C',
    humidity: '70%',
    weather_description: 'แดดจ้า',
    wind_speed: '2.5 m/s',
    cloudiness: '20%',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  it('ควร throw BadRequestException ถ้าไม่ได้ส่ง city มา', async () => {
    await expect(controller.getWeather(undefined as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('ควร return ข้อมูลเมื่อส่ง city ถูกต้อง', async () => {
    jest
      .spyOn(service, 'getWeather')
      .mockResolvedValue(mockWeatherResponse);

    const result = await controller.getWeather('Bangkok');

    expect(result).toEqual(mockWeatherResponse);
    expect(service.getWeather).toHaveBeenCalledWith('Bangkok');
  });
});
