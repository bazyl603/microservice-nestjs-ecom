import {
    IsNotEmpty,
    IsArray,
  } from 'class-validator';

export class LicenceKeyDto {
    @IsArray()
    @IsNotEmpty()
    licenceKey: string[];
}