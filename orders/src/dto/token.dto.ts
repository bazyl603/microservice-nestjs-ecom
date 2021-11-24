import {
    IsString,
    IsNotEmpty,
    isString,
  } from 'class-validator';

export class TokenDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}