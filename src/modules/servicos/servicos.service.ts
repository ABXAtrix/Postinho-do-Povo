import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { In } from 'typeorm';
import { ServicoRepository } from './servicos.repository';
import { CreateServicoDTO } from './dto/create.servico.dto';
import { UpdateServicoDTO } from './dto/update.servico.dto';
import { Servico } from './servicos.entity';
import { UnidadeSaudeRepository } from '../unidadesaude/unidadesaude.repository';

@Injectable()
export class ServicoService {
  constructor(
    private readonly servicoRepository: ServicoRepository,
    private readonly unidadeSaudeRepository: UnidadeSaudeRepository,
  ) {}

  // Criar um novo serviço
  async criar(createServicoDto: CreateServicoDTO): Promise<Servico> {
    const { nome, descricao, unidadesIds } = createServicoDto;

    const novoServico = new Servico({
      nome,
      descricao,
    });

    // Se foram passados IDs de unidades, fazemos a validação forte no banco de dados
    if (unidadesIds && unidadesIds.length > 0) {
      const unidadesEncontradas = await this.unidadeSaudeRepository['ormRepository'].find({
        where: { id: In(unidadesIds) },
      });

      if (unidadesEncontradas.length !== unidadesIds.length) {
        throw new BadRequestException('Uma ou mais Unidades de Saúde informadas não existem.');
      }

      novoServico.unidades = unidadesEncontradas;
    }

    return await this.servicoRepository.save(novoServico);
  }

  // Listar todos os serviços
  async listarTodos(): Promise<Servico[]> {
    return await this.servicoRepository.find();
  }

  // Buscar um serviço específico por ID (com as unidades inclusas)
  async buscarPorId(id: number): Promise<Servico> {
    return await this.servicoRepository.buscarPorIdComUnidades(id);
  }

  // Buscar serviços de uma unidade específica
  async buscarPorUnidade(unidadeId: number): Promise<Servico[]> {
    return await this.servicoRepository.buscarServicosPorUnidade(unidadeId);
  }

  // Atualizar dados e vínculos de um serviço
  async atualizar(id: number, updateServicoDto: UpdateServicoDTO): Promise<Servico> {
    // Garante que o serviço existe antes de atualizar
    const servico = await this.buscarPorId(id);

    const { nome, descricao, unidadesIds } = updateServicoDto;

    if (nome !== undefined) servico.nome = nome;
    if (descricao !== undefined) servico.descricao = descricao;

    // Se a lista de unidades foi enviada (mesmo que vazia para desvincular tudo), atualizamos a relação
    if (unidadesIds !== undefined) {
      if (unidadesIds.length > 0) {
        const unidadesEncontradas = await this.unidadeSaudeRepository['ormRepository'].find({
          where: { id: In(unidadesIds) },
        });

        if (unidadesEncontradas.length !== unidadesIds.length) {
          throw new BadRequestException('Uma ou mais Unidades de Saúde informadas não existem.');
        }
        servico.unidades = unidadesEncontradas;
      } else {
        servico.unidades = []; // Esvazia os vínculos se enviar um array vazio
      }
    }

    return await this.servicoRepository.save(servico);
  }

  // Remover um serviço do sistema
  async remover(id: number): Promise<void> {
    const servico = await this.buscarPorId(id);
    await this.servicoRepository.remove(servico);
  }
}