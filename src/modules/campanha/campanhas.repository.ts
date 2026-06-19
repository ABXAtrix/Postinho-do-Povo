import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Campanha } from './campanhas.entity';

@Injectable()
export class CampanhaRepository extends Repository<Campanha> {
  constructor(private dataSource: DataSource) {
    // Inicializa o repositório injetando a entidade Campanha e o gerenciador do TypeORM
    super(Campanha, dataSource.createEntityManager());
  }

  // Buscar uma campanha específica por ID trazendo todas as unidades que participam dela
  async buscarPorIdComUnidades(id: number): Promise<Campanha> {
    const campanha = await this.findOne({
      where: { id },
      relations: { unidades: true }, // Traz a lista de postinhos vinculados
    });

    if (!campanha) {
      throw new NotFoundException(`Campanha com o ID ${id} não foi encontrada.`);
    }

    return campanha;
  }

  // Consulta Inteligente: Listar apenas as campanhas que estão acontecendo no momento atual
  // Filtra onde a data de início já passou (ou é hoje) e a data de término ainda não chegou
  async buscarCampanhasAtivas(): Promise<Campanha[]> {
    const agora = new Date();
    return this.find({
      where: {
        dataInicio: LessThanOrEqual(agora),
        dataFim: MoreThanOrEqual(agora),
      },
      relations: { unidades: true },
    });
  }
}