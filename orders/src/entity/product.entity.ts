import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public productId: string;
 
  @Column()
  public title: string;

  @Column()
  public version: number;
}
 
export default Product;