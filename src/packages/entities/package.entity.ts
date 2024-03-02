import { Product } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  height: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @OneToMany(() => Product, (product) => product.package)
  products: Product[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
