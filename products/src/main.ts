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
  const RABBITMQ = configService.get('RABBITMQ');

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ],
      queue: 'products-queue',
      noAck: true,
      queueOptions: {
        durable: true,
      },
    }
  });

  await app.listen(PORT).then(() => console.log('[START] app started'));
  await app.startAllMicroservices().then(() => console.log('[START] microservice started')).catch((err) => {
    console.log(err);
  });
}
bootstrap();
