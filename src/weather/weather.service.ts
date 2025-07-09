import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);

    constructor(private httpService: HttpService) { }

    async getWeather(city: string) {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

        const response = await firstValueFrom(this.httpService.get(url));
        const data = response.data;

        return {
            เมือง: data.name,
            ประเทศ: data.sys.country,
            อุณหภูมิ: `${data.main.temp} °C`,
            อุณหภูมิที่รู้สึก: `${data.main.feels_like} °C`,
            ความชื้น: `${data.main.humidity}%`,
            สภาพอากาศ: data.weather[0].description,
            ความเร็วลม: `${data.wind.speed} m/s`,
            ปริมาณเมฆ: `${data.clouds.all}%`,
        };
    }

}
