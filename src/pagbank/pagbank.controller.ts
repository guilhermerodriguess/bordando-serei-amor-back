import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { Public } from 'src/auth/auth.decorator';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagbankService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.pagbankService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagbankService.remove(+id);
  }
}
