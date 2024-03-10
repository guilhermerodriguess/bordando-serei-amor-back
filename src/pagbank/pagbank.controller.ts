import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  HttpCode,
} from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { Public } from 'src/auth/auth.decorator';
import { CheckoutDto } from './dto/checkout.body';

@Controller('pagbank')
export class PagbankController {
  constructor(private readonly pagbankService: PagbankService) {}

  @Public()
  @Get('session')
  async create() {
    try {
      return await this.pagbankService.createSession();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Public()
  @Post('checkout')
  async checkout(@Body() body: CheckoutDto) {
    try {
      return await this.pagbankService.checkout(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Public()
  @Post('notification')
  @HttpCode(200)
  async notification(@Body() body: any) {
    try {
      return await this.pagbankService.notification(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
