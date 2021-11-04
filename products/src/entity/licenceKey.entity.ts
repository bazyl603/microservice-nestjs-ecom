import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
import { Products } from './products.entity';

  @Entity()
  export class LicenceKey {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false, unique: true })
    key: string;

    @ManyToOne(() => Products, products => products.licenceKey)
    products: Products
  }