import { Injectable } from '@nestjs/common';
import { CreatePagbankDto } from './dto/create-pagbank.dto';
import { UpdatePagbankDto } from './dto/update-pagbank.dto';

@Injectable()
export class PagbankService {
  create(createPagbankDto: CreatePagbankDto) {
    return 'This action adds a new pagbank';
  }

  publicKey() {
    const created_at = Date.now();
    const public_key = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwKZGNMvOX4c30QniQVly3ZQ/NDPWR7XzmDP5Icc2EP4yOgBZ3MaUHxcegR/1mPPkbFVRzYkGaA/tMddZNXsUUJwNYoOGiTPLBzt770+/Du6fea0yDB+n2WONPv13qM2gHOcEnHcP2Mfqj2RYa3Go/Cr2qDh0On1otLXV6vNB+NbPrOWz1uXetCiaUhNk70Hix29li28dwOYwmBDp6P132TBYn0RIaY4hmjVeX03kYBMafZNTcPIBalTjOQn9/ULw6IE2vfurJzWQaPfo6WaktYw/hiuyh72FU+lEJdwQMCbQAOsScnDGU5KEKgOEfddbWrv7KCORwf02yydwkdkF8wIDAQAB`;

    const response = {
      public_key,
      created_at,
    };

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagbank`;
  }

  update(id: number, updatePagbankDto: UpdatePagbankDto) {
    return `This action updates a #${id} pagbank`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagbank`;
  }
}
