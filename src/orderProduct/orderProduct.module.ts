import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './entities/orderProduct.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
})
export class OrderProductModule {}
