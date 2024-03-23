import { OrderProduct } from 'src/orderProduct/entities/orderProduct.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  status: number;

  @Column()
  method: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  cancellationSource: string;

  @Column()
  installmentCount: number;

  @Column()
  senderName: string;

  @Column()
  senderEmail: string;

  @Column()
  senderPhone: string;

  @Column()
  senderDocument: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  feeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extraAmount: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];
}
