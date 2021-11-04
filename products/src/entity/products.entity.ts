import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    VersionColumn,
    OneToMany,
  } from 'typeorm';
import { LicenceKey } from './licenceKey.entity';

  @Entity()
  export class Products {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false, unique: true })
    title: string;
  
    @Column({ nullable: false })
    price: number;

    @Column()
    image: string;

    @Column()
    description: string;

    @VersionColumn()
    version: number;

    @OneToMany(() => LicenceKey, licenceKey => licenceKey.products)
    licenceKey: LicenceKey[]
  }