import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter, CustomLogger, envs, logLevels } from './global';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const customLogger = new CustomLogger('Main');

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }
  ))

  app.setGlobalPrefix('api');

  await app.listen(envs.port);

  customLogger.setContext('Bootstrap');
  customLogger.setLevel(logLevels.LOG);
  customLogger.generateLog(`Server running on port ${envs.port}`);

}

void bootstrap();
