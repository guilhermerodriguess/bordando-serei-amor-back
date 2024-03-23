import { Module } from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { PagbankController } from './pagbank.controller';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/orderProduct/entities/orderProduct.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct, Product])],
  controllers: [PagbankController],
  providers: [PagbankService, OrdersService, ProductsService],
})
export class PagbankModule {}
