import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    VersionColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
import Product from './product.entity';

  @Entity()
  export class Orders {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    price: number;

    @OneToOne(() => Product, product => product.id, {
      eager: true,
      nullable: true
    })
    @JoinColumn()
    public product?: Product;

    @Column()
    userId: string;

    @Column()
    paymentStatus: string;

    @Column({ nullable: true })
    public licenceKey: string;

    @Column({ nullable: true })
    stripeId: string;

    @VersionColumn()
    version: number;
  }