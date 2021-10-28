import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

      create(createAdminDto: CreateUserDto) {
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
  
      async update(id: string, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
      }
  
      async remove(id: string) {
        const user = await this.findOne(id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
      }
}
