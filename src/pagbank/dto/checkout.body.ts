import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  senderHash: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsArray()
  @IsNotEmpty()
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;

  @IsOptional()
  @IsString()
  creditCardToken: string;

  @IsOptional()
  @IsObject()
  installment: {
    quantity: number;
    installmentAmount: number;
    totalAmount: number;
    interestFree: boolean;
  };

  @IsOptional()
  @IsObject()
  holder: {
    name: string;
    document: string;
    birthDate: string;
    phone: string;
  };
}
