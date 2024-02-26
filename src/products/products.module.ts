import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ImagesService } from 'src/images/images.service';
import { Image } from '../images/entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image])],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
})
export class ProductsModule {}
