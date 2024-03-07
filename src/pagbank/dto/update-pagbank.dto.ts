import { PartialType } from '@nestjs/mapped-types';
import { CreatePagbankDto } from './create-pagbank.dto';

export class UpdatePagbankDto extends PartialType(CreatePagbankDto) {}
