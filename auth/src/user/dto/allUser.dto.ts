import { Expose } from 'class-transformer';

export class AllUserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    role: string;
}