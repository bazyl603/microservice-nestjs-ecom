import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsArray,
  } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    image: string;

    @IsString()
    description: string;

    @IsArray()
    licenceKey: [];
}