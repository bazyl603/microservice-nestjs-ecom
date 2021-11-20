import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';

export class DeleteProductDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}