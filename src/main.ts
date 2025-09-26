import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  app.enableCors({
    origin: process.env.FRONT_ADRESS, // フロントのURLを指定
    credentials: true, // Cookieや認証情報を扱うなら必要
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
