import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}
  async create(createCardDto: CreateCardDto) {
    const card = await this.cardRepository.save(createCardDto);

    if (!card) {
      throw new Error('Erro ao salvar card');
    }

    return card;
  }

  async findAll() {
    const cards = await this.cardRepository.find();
    if (!cards) {
      throw new Error('Nenhum card encontrado');
    }

    return cards;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const card = await this.cardRepository.findOne({ where: { id } });

    if (!card) {
      throw new Error('Card não encontrado');
    }

    const updated = await this.cardRepository.update(id, updateCardDto);

    if (!updated.affected) {
      throw new Error('Erro ao atualizar card');
    }

    return updated;
  }

  async remove(id: string) {
    const card = await this.cardRepository.findOne({ where: { id } });

    if (!card) {
      throw new Error('Card não encontrado');
    }

    const deletedCard = await this.cardRepository.delete(id);

    if (!deletedCard.affected) {
      throw new Error('Erro ao deletar card');
    }

    return deletedCard;
  }
}
