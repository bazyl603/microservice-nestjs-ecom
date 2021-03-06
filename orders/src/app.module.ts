import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import Product from './entity/product.entity';
import { Orders } from './entity/orders.entity';
import { CurrentUserMiddleware } from './middlewares/currentUser.middleware';
import * as Joi from 'joi';
import { StripeService } from './stripe.service';
import { PdfService } from './pdf.service';
import { HttpModule } from '@nestjs/axios';

dotenv.config({ path: '../.env' });

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
       isGlobal: true,
       envFilePath: '.env',
       validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
       }),
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Orders]),
  ],
  controllers: [AppController],
  providers: [AppService, StripeService, PdfService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: 'PRODUCTS-SERVICE',
      useFactory: (configService: ConfigService) => {
        const RABBITMQ = configService.get('RABBITMQ');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [RABBITMQ],
            queue: 'products-queue',
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
