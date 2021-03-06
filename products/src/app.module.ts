import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LicenceKey } from './entity/licenceKey.entity';
import { Products } from './entity/products.entity';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { FileService } from './file.service';
import Image from './entity/image.entity';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { CurrentUserMiddleware } from './middlewares/currentUser.middleware';
import { HttpModule } from '@nestjs/axios';

dotenv.config({ path: '../.env' });

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
       isGlobal: true,
       envFilePath: '.env',
       validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
       }),
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Products]),
    TypeOrmModule.forFeature([LicenceKey]),
    TypeOrmModule.forFeature([Image]),
  ],
  controllers: [AppController],
  providers: [AppService,
    FileService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: 'ORDER-SERVICE',
      useFactory: (configService: ConfigService) => {
        const RABBITMQ = configService.get('RABBITMQ');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [RABBITMQ],
            queue: 'orders-queue',
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      inject: [ConfigService],
    }
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
        CurrentUserMiddleware
      )
      .forRoutes('*');
  }
}
