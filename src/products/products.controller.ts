import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/auth/auth.decorator';
import { HttpService } from '@nestjs/axios';

export interface IQuery {
  limit: number;
  page: number;
  search: string;
  filter: string;
  category: string;
  orderBy: string;
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);

      return {
        message: 'Produto criado com sucesso!',
        id: product.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Public()
  @Get()
  async findAll(@Query() query: IQuery) {
    try {
      return await this.productsService.findAll(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productsService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      await this.productsService.update(id, updateProductDto);
      return {
        message: 'Produto atualizado com sucesso!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(id);
      return {
        message: 'Produto removido com sucesso!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Public()
  @Post('calc-delivery')
  async calcDelivery(@Body() body: any) {
    try {
      const meAPIURL = process.env.ME_API_URL;
      const meTOKEN = process.env.ME_TOKEN;

      const response = await this.httpService
        .post(
          `${meAPIURL}/calc-delivery`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${meTOKEN}`,
            },
          },
        )
        .toPromise();

      const services = [1, 2, 3, 4, 33];

      const filteredResponse = response.data.filter(
        (item) => !item.error && services.includes(item.id),
      );

      return filteredResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
