import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  await app.listen(3000);
  console.log('🚀 API Gateway is running on http://localhost:3000');
  console.log('📋 Endpoints:');
  console.log('  POST /urls - Create short URL');
  console.log('  GET /:code - Redirect to original URL');
  console.log('  GET /health - Health check');
}
bootstrap();