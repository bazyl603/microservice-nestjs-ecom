import { Injectable } from '@nestjs/common';
import { AdminRoleType } from 'entity/admin.entity';
import { AdminService } from './admin.service';

@Injectable()
export class AuthService {
    constructor(private adminService: AdminService) {}

    async signup(email: string, password: string, firstName: string, lastName: string, phoneNumber: number, role: AdminRoleType){
        return this.adminService.create( email, password, firstName, lastName, phoneNumber, role );
    }
}
