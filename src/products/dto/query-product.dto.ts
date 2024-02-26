import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class QueryProduct extends PartialType(CreateProductDto) {
  id?: string;
}
