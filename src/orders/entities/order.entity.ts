import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  status: number;

  @Column()
  method: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
