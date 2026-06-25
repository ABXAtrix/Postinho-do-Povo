import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Faq } from './faq.entity';

@Injectable()
export class FaqRepository extends Repository<Faq> {
  constructor(private dataSource: DataSource) {
    super(Faq, dataSource.createEntityManager());
  }

  // Busca as perguntas de uma campanha específica
  async buscarPorCampanha(campanhaId: number): Promise<Faq[]> {
    return this.find({
      where: { campanha: { id: campanhaId } },
    });
  }

  // Busca as perguntas de um postinho específico
  async buscarPorUnidade(unidadeId: number): Promise<Faq[]> {
    return this.find({
      where: { unidadeSaude: { id: unidadeId } },
    });
  }
}