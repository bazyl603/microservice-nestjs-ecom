import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'entity/admin.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/createAdmin.dto';

@Injectable()
export class AdminService {
    constructor(
      @InjectRepository(Admin) private readonly repo: Repository<Admin>,
    ) {}

    create(createAdminDto: CreateAdminDto) {
        const admin = this.repo.create(createAdminDto);
    
        return this.repo.save(admin);
      }

    findOne(id: string) {
      if (!id) {
        return null;
      }
      return this.repo.findOne(id);
    }

    find(email: string) {
      return this.repo.find({ email });
    }

    all() {
      return this.repo.find();
    }

    async update(id: string, attrs: Partial<Admin>) {
      const user = await this.repo.findOne(id);
      if (user.email === attrs.email) {
        throw new BadRequestException('valid email')
      }
      if (!user) {
        throw new NotFoundException('user not found');
      }
      Object.assign(user, attrs);
      return this.repo.save(user);
    }

    async remove(id: string) {
      const user = await this.repo.findOne(id);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return this.repo.remove(user);
    }
}
