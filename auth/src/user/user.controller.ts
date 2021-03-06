import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'entity/user.entity';
import { CurrentUser } from 'src/decorators/curentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/auth/user')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('/signup')
    @Serialize(UserDto)
    async create(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body);
        session.user = { id: user.id, email: user.email, role: user.role }
        return user;
    }

    @Post('/signin')
    @Serialize(UserDto)
    async signInAdmin(@Body() body: LoginUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.user = { id: user.id, email: user.email, role: user.role }
        return user;
    }

    @Post('/signout')
    async signOutAdmin(@Session() session: any) {
        session.user = {};
        return {};
    }

    @Get('/:id')
    @Serialize(UserDto)
    @UseGuards(AuthGuard)
    getOne(@Param('id') id: string, @Session() session: any) {
        if(session.user.id !== id){
            throw new UnauthorizedException('no authorized!');            
        }
        return this.userService.findOne(id);
    }

    @Patch('/editUser/:id')
    @UseGuards(AuthGuard)
    edit(@Body() body: CreateUserDto , @Param('id') id: string, @Session() session: any) {
        if(session.user.id !== id){
            throw new UnauthorizedException('no authorized!');   
        }
        return this.userService.update(id, body);  
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteUser(@Param('id') id: string, @Session() session: any) {
        if(session.user.id !== id){
            throw new UnauthorizedException('no authorized!');            
        }
        return this.userService.remove(id);
    }
}
