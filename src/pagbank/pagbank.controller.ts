import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { CreatePagbankDto } from './dto/create-pagbank.dto';
import { UpdatePagbankDto } from './dto/update-pagbank.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('pagbank')
export class PagbankController {
  constructor(private readonly pagbankService: PagbankService) {}

  @Post()
  create(@Body() createPagbankDto: CreatePagbankDto) {
    return this.pagbankService.create(createPagbankDto);
  }

  @Public()
  @Get('public-key')
  publicKey() {
    try {
      return this.pagbankService.publicKey();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagbankService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagbankDto: UpdatePagbankDto) {
    return this.pagbankService.update(+id, updatePagbankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagbankService.remove(+id);
  }
}
