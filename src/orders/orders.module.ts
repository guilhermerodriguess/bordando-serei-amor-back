import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderProduct } from 'src/orderProduct/entities/orderProduct.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct, Product])],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService],
  exports: [OrdersService],
})
export class OrdersModule {}
