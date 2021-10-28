import {
    IsString,
    IsNumber,
    IsEmail,
    IsNotEmpty,
  } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsNumber()
    phoneNumber: number;

    @IsString()
    role: string;
}