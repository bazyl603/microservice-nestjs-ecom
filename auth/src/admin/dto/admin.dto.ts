import { Expose } from 'class-transformer';

export class AdminDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    phoneNumber: number;

    @Expose()
    role: string;
}