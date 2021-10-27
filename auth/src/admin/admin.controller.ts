import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';

@Controller('api/admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private authService: AuthService
    ) {}

    @Get()
    getadmin() {
        return this.authService.signup('test@test', 'haslo', "tomek", "adam", 9999999, "admin")
    }
}
