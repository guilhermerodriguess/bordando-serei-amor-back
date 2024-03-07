import { Module } from '@nestjs/common';
import { PagbankService } from './pagbank.service';
import { PagbankController } from './pagbank.controller';

@Module({
  controllers: [PagbankController],
  providers: [PagbankService],
})
export class PagbankModule {}
