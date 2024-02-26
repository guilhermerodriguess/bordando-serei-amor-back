import { Image } from 'src/images/entities/images.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  status: boolean;

  @Column()
  image: string;

  @Column()
  home: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
