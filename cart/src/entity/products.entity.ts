import {
    Entity,
    Column,
    ManyToOne,
  } from 'typeorm';
import { Cart } from './cart.entity';

  @Entity()
  export class Products {
    @Column({ nullable: false, unique: true })
    id: string;
  
    @Column({ nullable: false, unique: true })
    title: string;
  
    @Column({ nullable: false })
    price: number;    

    @Column()
    version: number;

    @ManyToOne(() => Cart, cart => cart.id)
    cart: Cart
  }