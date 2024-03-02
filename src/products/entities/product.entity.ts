import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Image } from 'src/images/entities/images.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Package } from 'src/packages/entities/package.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column()
  stock: number;

  @Column()
  status: boolean;

  @Column()
  delivery: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @ManyToOne(() => Package, (pack) => pack.products, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  package: Package;

  @ManyToOne(() => Category, (category) => category.products, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  category: Category;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
