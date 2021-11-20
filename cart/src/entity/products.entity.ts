import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
  } from 'typeorm';
import { Cart } from './cart.entity';

  @Entity()
  export class Products {
    @PrimaryColumn()
    id: string;
  
    @Column({ nullable: false, unique: true })
    title: string;
  
    @Column({ nullable: false })
    price: number;    

    @Column()
    version: number;

    @ManyToOne(() => Cart, cart => cart.products)
    cart: Cart
  }