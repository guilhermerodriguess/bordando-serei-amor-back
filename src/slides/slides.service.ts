import { Injectable } from '@nestjs/common';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private slideRepository: Repository<Slide>,
  ) {}
  async create(files: Array<Express.Multer.File>) {
    const images: Slide[] = [];

    for (const file of files) {
      const image = new CreateSlideDto();
      image.name = file.filename;

      const savedImage = await this.slideRepository.save(image);
      if (!savedImage) {
        throw new Error('Erro ao salvar imagem no banco de dados');
      }
      images.push(savedImage);
    }

    return images;
  }

  async findAll() {
    const slides = await this.slideRepository.find();
    if (!slides) {
      throw new Error('Nenhuma imagem encontrada');
    }

    return slides;
  }

  async remove(id: string) {
    const slide = await this.slideRepository.findOne({ where: { id } });
    if (!slide) {
      throw new Error('Imagem não encontrada');
    }

    const deleted = await this.slideRepository.delete(id);

    if (!deleted.affected) {
      throw new Error('Erro ao deletar imagem');
    }

    return deleted;
  }
}
