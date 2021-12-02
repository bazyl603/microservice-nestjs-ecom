import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT');
  const RABBITMQ = configService.get('RABBITMQ');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ],
      queue: 'orders-queue',
      noAck: true,
      queueOptions: {
        durable: true,
      },
    }
  });

  const c = new DocumentBuilder()
    .setTitle('orders')
    .setDescription('The orders API description')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, c);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT).then(() => console.log('[START] app started'));
  await app.startAllMicroservices().then(() => console.log('[START] microservice started')).catch((err) => {
    console.log(err);
  });
}
bootstrap();
