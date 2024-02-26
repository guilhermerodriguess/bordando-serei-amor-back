import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { Image } from '../entities/images.entity';

export class UploadImageDto extends PartialType(Image) {
  @IsNotEmpty()
  name: string;
}
