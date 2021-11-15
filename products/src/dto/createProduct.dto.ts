import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    price: number;

    @IsString()
    description: string;
}