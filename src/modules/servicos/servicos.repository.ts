import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Servico } from './servicos.entity';

@Injectable()
export class ServicoRepository extends Repository<Servico> {
  constructor(private dataSource: DataSource) {
    // Inicializa o repositório nativo do TypeORM injetando a entidade Servico
    super(Servico, dataSource.createEntityManager());
  }

  // Buscar um serviço por ID trazendo junto as Unidades de Saúde que o oferecem
async buscarPorIdComUnidades(id: number): Promise<Servico> {
    const servico = await this.findOne({
      where: { id },
      relations: { unidades: true },
    });

    if (!servico) {
      throw new NotFoundException(`Serviço com o ID ${id} não foi encontrado.`);
    }

    return servico;
  }

  // Buscar todos os serviços vinculados a uma Unidade de Saúde específica
  async buscarServicosPorUnidade(unidadeId: number): Promise<Servico[]> {
    return this.find({
      where: {
        unidades: {
          id: unidadeId,
        },
      },
    });
  }
}