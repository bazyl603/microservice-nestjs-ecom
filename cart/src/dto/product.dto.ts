import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    version: number;
}