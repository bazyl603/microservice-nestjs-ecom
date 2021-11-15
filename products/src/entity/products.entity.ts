import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    VersionColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
import Image from './image.entity';
import { LicenceKey } from './licenceKey.entity';

  @Entity()
  export class Products {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false, unique: true })
    title: string;
  
    @Column({ nullable: false })
    price: number;

    @OneToOne(() => Image, image => image.id, {
      eager: true,
      nullable: true
    })
    @JoinColumn()
    public image?: Image;

    @Column()
    description: string;

    @VersionColumn()
    version: number;

    @OneToMany(() => LicenceKey, licenceKey => licenceKey.products)
    licenceKey: LicenceKey[]
  }