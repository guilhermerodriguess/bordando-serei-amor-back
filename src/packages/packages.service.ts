import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
  ) {}
  async create(createPackageDto: CreatePackageDto) {
    const createdPackage = await this.packagesRepository.save(createPackageDto);

    if (!createdPackage) {
      throw new Error('Erro ao cadastrar pacote');
    }

    return createdPackage;
  }

  async findAll() {
    const packages = await this.packagesRepository.find();
    return packages;
  }

  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const updatedPackage = await this.packagesRepository.update(
      id,
      updatePackageDto,
    );

    if (!updatedPackage.affected) {
      throw new Error('Erro ao atualizar pacote');
    }

    return updatedPackage;
  }

  async remove(id: number) {
    const deletedPackage = await this.packagesRepository.delete(id);

    if (!deletedPackage.affected) {
      throw new Error('Erro ao deletar pacote');
    }

    return deletedPackage;
  }
}
