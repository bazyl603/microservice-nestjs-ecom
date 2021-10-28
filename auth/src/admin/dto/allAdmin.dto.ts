import { Expose } from 'class-transformer';

export class AllAdminDto {
    @Expose()
    id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    role: string;
}