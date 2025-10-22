import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOにないプロパティを自動で削除
      forbidNonWhitelisted: true, // 不要なプロパティがある場合エラー
      transform: true, // 自動的に DTO クラスに変換
      exceptionFactory: (errors) => {
        // errors は ValidationError の配列
        const messages = errors.map((err) => {
          // err.constraints は undefined になる可能性があるため空オブジェクトでフォールバックする
          return Object.values(err.constraints ?? {}).join(', ');
        });
        return new BadRequestException({ success: false, errors: messages });
      },
    }),
  );

  app.enableCors({
    origin: process.env.FRONT_ADRESS, // フロントのURLを指定
    credentials: true, // Cookieや認証情報を扱うなら必要
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
