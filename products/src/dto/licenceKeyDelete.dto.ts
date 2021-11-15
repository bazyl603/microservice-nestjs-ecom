import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class LicenceKeyDeleteDto {
    @IsString()
    @IsNotEmpty()
    licenceKey: string;
}