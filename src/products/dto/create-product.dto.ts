import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Package } from 'src/packages/entities/package.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  category: Category;

  @IsNotEmpty()
  package: Package;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsBoolean()
  delivery: boolean;
}
