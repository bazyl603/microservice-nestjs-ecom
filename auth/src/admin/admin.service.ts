import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'entity/admin.entity';
import { Repository } from 'typeorm';
import { AdminRoleType } from '../../entity/admin.entity';

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Admin) private repo: Repository<Admin>) {}

    create(email: string, password: string, firstName: string, lastName: string, phoneNumber: number, role: AdminRoleType) {
        const admin = this.repo.create({ email, password, firstName, lastName, phoneNumber, role });
    
        return this.repo.save(admin);
      }
}
