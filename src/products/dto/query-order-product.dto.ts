import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class QueryOrderProduct extends PartialType(CreateProductDto) {
  createdAt?: string;
}
