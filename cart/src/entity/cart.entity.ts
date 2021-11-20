import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { Products } from './products.entity';

  @Entity()
  export class Cart {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    userId: string;

    @OneToMany(() => Products, products => products.cart, {
      eager: true,
      nullable: true
    })
    @JoinColumn()
    public products?: Products;
  }