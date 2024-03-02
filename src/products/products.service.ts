import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQuery } from './products.controller';
import { QueryProduct } from './dto/query-product.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.save(createProductDto);
    if (!product) {
      throw new Error('Erro ao criar produto');
    }

    return product;
  }

  async findAll(query: IQuery) {
    const { search, category, orderBy } = query;
    let { limit, page } = query;
    limit = Number(limit) || 12;
    page = Number(page) || 1;

    const where: QueryProduct = {};
    const order: { [key: string]: 'ASC' | 'DESC' } = {};

    if (search) {
      where.id = search;
    }

    if (category) {
      where.category = { id: category } as Category;
    }

    if (orderBy) {
      if (orderBy === 'ascPrice') {
        order.price = 'ASC';
      } else if (orderBy === 'descPrice') {
        order.price = 'DESC';
      } else if (orderBy === 'ascName') {
        order.name = 'ASC';
      } else if (orderBy === 'descName') {
        order.name = 'DESC';
      }
    }

    const [products, total] = await this.productRepository.findAndCount({
      relations: ['images', 'category'],
      where,
      take: limit,
      skip: limit * (page - 1),
      order,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: products,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'package'],
    });
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { name, price, description, status, delivery } =
      await this.productRepository.findOne({
        where: { id },
      });

    if (
      name === updateProductDto.name &&
      price === updateProductDto.price &&
      description === updateProductDto.description &&
      status === updateProductDto.status &&
      delivery === updateProductDto.delivery
    ) {
      throw new Error('Nenhum campo foi alterado');
    }

    const product = await this.productRepository.update(id, updateProductDto);
    if (!product.affected) {
      throw new Error('Produto não encontrado');
    }

    return await this.findOne(id);
  }

  async remove(id: string) {
    const removedProduct = await this.productRepository.delete(id);
    if (!removedProduct.affected) {
      throw new Error('Produto não encontrado');
    }
  }
}
