import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly adminService: AdminService) {}

    async signup(createAdminDto: CreateAdminDto){
        const users = await this.adminService.find(createAdminDto.email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        if (createAdminDto.role === "admin") {
             
            const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

            try{
                const createAdmin = await this.adminService.create({
                    ...createAdminDto,
                    password: hashedPassword
                });
                return createAdmin;
            } catch (err) {
                throw new NotFoundException('somthing is wrong');
            }
        }

        throw new BadRequestException('bad role');        
    }

    async signin(email: string, password: string) {
        const [user] = await this.adminService.find(email);
        if (!user) {
          throw new NotFoundException('user not found');
        }

        if(password === user.password) {
            return user;
        }

        const isMach = await bcrypt.compare(password, user.password);

        if(isMach) {
            return user            
        }

        throw new BadRequestException('bad password');
      }
}
