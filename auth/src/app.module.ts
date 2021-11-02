import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
const cookieSession = require('cookie-session');
import { AdminService } from './admin/admin.service';
import { UserService } from './user/user.service';
import { Admin } from 'entity/admin.entity';
import { User } from 'entity/user.entity';
import { AuthService as AuthUserService } from './user/auth.service';
import { AuthService as AuthAdminService } from './admin/auth.service';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule, AdminModule,
    ConfigModule.forRoot({
       isGlobal: true,
       ignoreEnvFile: true
    }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController, AdminController, AppController],
  providers: [AdminService, UserService, AuthUserService, AuthAdminService,
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
          keys: process.env.COOKIE_KEY,
        }),
      )
      .forRoutes('*');
  }
}
