import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
  export class Admin {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false, unique: true })
    email: string;
  
    @Column({ nullable: false })
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    phoneNumber: number;

    @Column({
      nullable: false,
      default: "admin"
    })
    role: string
  }