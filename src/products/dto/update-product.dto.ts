import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Image } from 'src/images/entities/images.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  images?: Image[];
}
