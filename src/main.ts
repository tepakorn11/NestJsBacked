// src/main.ts
import '../utils/json-bigint-polyfill'; // <<< ต้องอยู่บนสุด!
// import * as dotenv      from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
// dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'], // ✅ เพิ่ม logger debug
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  // ใช้ที่นี่แล้วใช้ได้ทุก controller
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (error) => {
        const messages = error.map((err) => {
          const field = err.property;
          const constraints = Object.values(err.constraints || {}).join(',');
          return `Field (ฟิลด์) "${field}" Fail (ไม่ถูกต้อง): ${constraints}`;
        });
        return new BadRequestException(messages);
      },
    }),
  );
  // ✅ เพิ่มตรงนี้ เพื่อเปิด Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('ระบบ API ทั้งหมด')
    .setVersion('1.0')
    .addBearerAuth() // ถ้ามีใช้ JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // ใช้ผ่าน /api-docs
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.LOCAL_PORT || 3001);
  console.log(
    `🚀 Backend listening on http://localhost:${process.env.LOCAL_PORT || 3001}`,
  );
  console.log(
    `📚 Swagger at http://localhost:${process.env.LOCAL_PORT || 3001}/api-docs`,
  );
}
bootstrap();
