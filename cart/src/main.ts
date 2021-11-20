import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
    }
  });

  await app.listen(PORT).then(() => console.log('[START] app started'));
  await app.startAllMicroservices().then(() => console.log('[START] microservice started')).catch((err) => {
    console.log(err);
  });
}
bootstrap();
