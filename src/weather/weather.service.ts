import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);

    constructor(private httpService: HttpService) {}

    async getWeather(city: string) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));
            const data = response.data;

            return {
                city: data.name,
                country: data.sys.country,
                temperature: `${data.main.temp} °C`,
                feels_like: `${data.main.feels_like} °C`,
                humidity: `${data.main.humidity}%`,
                weather_description: data.weather[0].description,
                wind_speed: `${data.wind.speed} m/s`,
                cloudiness: `${data.clouds.all}%`,
            };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new NotFoundException(`ไม่พบข้อมูลของเมือง "${city}"`);
            }

            this.logger.error(`Failed to fetch weather for "${city}"`, error?.message || error);
            throw new InternalServerErrorException(`ไม่สามารถดึงข้อมูลของ "${city}" ได้`);
        }
    }
}
