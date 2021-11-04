import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LicenceKey } from './entity/licenceKey.entity';
import { Products } from './entity/products.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal: true,
       envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Products]),
    TypeOrmModule.forFeature([LicenceKey]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
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
      )
      .forRoutes('*');
  }
}
