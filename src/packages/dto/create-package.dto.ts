import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  height: number;

  @IsString()
  @IsNotEmpty()
  width: number;

  @IsString()
  @IsNotEmpty()
  length: number;

  @IsString()
  @IsNotEmpty()
  weight: number;
}
