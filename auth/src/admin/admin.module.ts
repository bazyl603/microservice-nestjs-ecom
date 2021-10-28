import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from 'entity/admin.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from 'src/middlewares/currentUser.middleware';
import { UserService } from 'src/user/user.service';
import { User } from 'entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [AdminService, AuthService, UserService]
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
