import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', 'localhost');

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));

  await app.listen(port);
  console.log(`🚀 Application is running on: http://${host}:${port}`);
}
bootstrap();
