import { Controller, Get, Post, Session, UseGuards } from '@nestjs/common';
import { Admin } from 'entity/admin.entity';
import { User } from 'entity/user.entity';
import { CurrentUser } from './decorators/curentUser.decorator';
import { AuthGuard } from './guards/auth.guard';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './user/dto/user.dto';

@Controller('api/auth')
export class AppController {
    constructor() {}

    @Get('/whoami')
    @Serialize(UserDto)
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User | Admin) {
      return user;
    }

    @Post('/signout')
    async signOutAdmin(@Session() session: any) {
        session.user = {};
        return {};
    }
}
