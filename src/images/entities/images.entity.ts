import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.images, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: string;

  @CreateDateColumn()
  createdDate: Date;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
