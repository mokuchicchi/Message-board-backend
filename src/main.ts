import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // フロントのURLを指定
    credentials: true, // Cookieや認証情報を扱うなら必要
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
