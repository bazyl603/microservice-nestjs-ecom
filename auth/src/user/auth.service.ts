import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async signup(createUserDto: CreateUserDto){
        const users = await this.userService.find(createUserDto.email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }        
             
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        try{
            const createUser = await this.userService.create({
                ...createUserDto,
                password: hashedPassword
            });
            return createUser;
        } catch (err) {
            throw new NotFoundException('somthing is wrong');
        }       
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
          throw new NotFoundException('user not found');
        }

        const isMach = await bcrypt.compare(password, user.password);

        if(isMach) {
            return user            
        }

        throw new BadRequestException('bad password or user not found');
      }
}
