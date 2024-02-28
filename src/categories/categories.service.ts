import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import S3Storage from 'utils/S3Storage';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    files: Array<Express.Multer.File>,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const newCategory = {
      ...createCategoryDto,
      image: files ? files[0].filename : null,
      home: Boolean(createCategoryDto.home),
      status: Boolean(createCategoryDto.status),
    };

    const s3Storage = new S3Storage();
    if (files) {
      await s3Storage.saveFile(files[0].filename);
    }

    const category = await this.categoryRepository.save(newCategory);
    if (!category) {
      throw new Error('Erro ao criar categoria');
    }

    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
    if (!categories) {
      throw new Error('Erro ao buscar categorias');
    }

    return categories;
  }

  findOne(id: string) {
    const category = this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );
    if (!category.affected) {
      throw new Error('Erro ao atualizar categoria');
    }

    const updatedCategory = await this.findOne(id);

    return updatedCategory;
  }

  async remove(id: string) {
    const s3Storage = new S3Storage();

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Categoria não encontrada');
    }
    if (category.image) {
      await s3Storage.deleteFile(category.image);
    }

    const removedCategory = await this.categoryRepository.delete(id);

    if (!removedCategory.affected) {
      throw new Error('Erro ao deletar categoria');
    }
  }
}
