// weather.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';


describe('WeatherService (clean)', () => {
  let service: WeatherService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(WeatherService);
    httpService = module.get(HttpService);
  });

  it('ควรคืนข้อมูลเมื่อค้นหาเมืองถูกต้อง', async () => {
    const mockData = {
      data: {
        name: 'Bangkok',
        main: { temp: 30 },
        weather: [{ description: 'แดดจ้า' }],
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockData as any));

    const result = await service.getWeather('Bangkok');

    expect(result).toEqual({
      city: 'Bangkok',
      temperature: '30 °C',
      weather_description: 'แดดจ้า',
    });
  });

  it('ควรโยน NotFoundException เมื่อไม่พบเมือง', async () => {
    const mockError = { response: { status: 404 } };
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => mockError));

    await expect(service.getWeather('Unknown')).rejects.toThrow(NotFoundException);
  });

  it('ควรโยน InternalServerErrorException เมื่อ error อื่นเกิดขึ้น', async () => {
    const mockError = new Error('timeout');
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => mockError));

    await expect(service.getWeather('Bangkok')).rejects.toThrow(InternalServerErrorException);
  });
});
