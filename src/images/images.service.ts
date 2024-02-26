import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/images.entity';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(files: Array<Express.Multer.File>, product_id: string) {
    const images: Image[] = [];

    for (const file of files) {
      const image = new UploadImageDto();
      image.name = file.filename;
      image.product = product_id;

      const savedImage = await this.imageRepository.save(image);
      if (!savedImage) {
        throw new Error('Erro ao salvar imagem no banco de dados');
      }
      images.push(savedImage);
    }

    return images;
  }

  async remove(id: string) {
    const removedImage = await this.imageRepository.delete(id);
    if (!removedImage.affected) {
      throw new Error('Erro ao remover imagem');
    }
    return removedImage;
  }
}
