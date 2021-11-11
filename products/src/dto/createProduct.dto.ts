import {
    IsString,
    IsNotEmpty,
    IsArray,
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

    @IsArray()
    licenceKey: [];
}