import { Body, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AdminDto } from './dto/admin.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/curentUser.decorator';
import { Admin } from 'entity/admin.entity';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserService } from 'src/user/user.service';
import { AllAdminDto } from './dto/allAdmin.dto';
import { AllUserDto } from 'src/user/dto/allUser.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('api/admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Get('/whoami')
    @Serialize(AdminDto)
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: Admin) {
      return user;
    }

    @Get('/whoamiAdmin')
    @Serialize(AdminDto)
    @UseGuards(AdminGuard)
    whoAmIAdmin(@CurrentUser() user: Admin) {
      return user;
    }

    @Post('/createAdmin')
    @Serialize(AdminDto)
    @UseGuards(AdminGuard)
    async create(@Body() body: CreateAdminDto) {
        const admin = await this.authService.signup(body);
        return admin;
    }

    @Post('/signin')
    @Serialize(AdminDto)
    async signInAdmin(@Body() body: LoginAdminDto, @Session() session: any) {
        const admin = await this.authService.signin(body.email, body.password);
        session.user = { id: admin.id, email: admin.email, role: admin.role }
        return admin;
    }

    @Post('/signout')
    async signOutAdmin(@Session() session: any) {
        session.user = {};
        return {};
    }

    @Get('/')
    @Serialize(AllAdminDto)
    @UseGuards(AdminGuard)
    getAll() {
        return this.adminService.all();
    }

    @Get('/:id')
    @Serialize(AdminDto)
    @UseGuards(AdminGuard)
    getOne(@Param('id') id: string) {
        return this.adminService.findOne(id);
    }

    @Patch('/editAdmin/:id')
    @UseGuards(AdminGuard)
    edit(@Body() body: CreateAdminDto , @Param('id') id: string) {
        return this.adminService.update(id, body);
    }

    @Delete('/:id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string) {
        return this.adminService.remove(id);
    }

    @Get('/user')
    @Serialize(AllUserDto)
    @UseGuards(AdminGuard)
    getAllUser() {
        return this.userService.all();
    }

    @Get('/user/:id')
    @Serialize(UserDto)
    @UseGuards(AdminGuard)
    getOneUser(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Delete('/user/:id')
    @UseGuards(AdminGuard)
    deleteUser(@Param('id') id: string) {
        return this.userService.remove(id);
    }

}
