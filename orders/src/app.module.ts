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
//import { CurrentUserMiddleware } from './middlewares/currentUser.middleware';

dotenv.config({ path: '../.env' });

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal: true,
       envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Orders]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: 'PRODUCTS-SERVICE',
      useFactory: (configService: ConfigService) => { 
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
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
        //CurrentUserMiddleware,
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),        
      )
      .forRoutes('*');
  }
}
