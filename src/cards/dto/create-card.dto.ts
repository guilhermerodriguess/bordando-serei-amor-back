import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsString()
  icon: string;
}
