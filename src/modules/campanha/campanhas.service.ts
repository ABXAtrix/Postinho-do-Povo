import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { In } from 'typeorm';
import { CampanhaRepository } from './campanhas.repository';
import { CreateCampanhasDTO } from './dto/create.campanhas.dto';
import { UpdateCampanhasDTO } from './dto/update.campanhas.dto';
import { Campanha } from './campanhas.entity';
import { UnidadeSaudeRepository } from '../unidadesaude/unidadesaude.repository';
import { CargosEnum } from '@/enums/cargos.enum'; 
import { NotificacoesGateway } from './campanhas.gateway';

@Injectable()
export class CampanhaService {
  constructor(
    private readonly campanhaRepository: CampanhaRepository,
    private readonly unidadeSaudeRepository: UnidadeSaudeRepository, // Injeção de dependência para validação forte dos postinhos de saúde
    private readonly notificacoesGateway: NotificacoesGateway, // Injeção do gateway para notificações em tempo real
  ) {}

  // Método auxiliar adaptado para validar usando o CargosEnum
  private verificarSeEhAgente(cargo: CargosEnum): void {
    if (cargo !== CargosEnum.AgenteSaude) {
      throw new ForbiddenException('Apenas agentes de saúde possuem permissão para gerenciar campanhas.');
    }
  }

  // Criar uma nova campanha (Apenas Agentes)
  async criar(createDto: CreateCampanhasDTO, usuarioCargo: CargosEnum): Promise<Campanha> {
    // 1. Valida se quem está criando é um agente de saúde usando o enum
    this.verificarSeEhAgente(usuarioCargo);

    const { titulo, descricao, publicoAlvo, dataInicio, dataFim, local, unidadesIds } = createDto;

    const novaCampanha = new Campanha({
      titulo,
      descricao,
      publicoAlvo,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      local,
    });

    // 2. Validação forte dos postos de saúde associados
    if (unidadesIds && unidadesIds.length > 0) {
      const unidadesEncontradas = await this.unidadeSaudeRepository['ormRepository'].find({
        where: { id: In(unidadesIds) },
      });

      if (unidadesEncontradas.length !== unidadesIds.length) {
        throw new BadRequestException('Uma ou mais Unidades de Saúde informadas não existem no sistema.');
      }

      novaCampanha.unidades = unidadesEncontradas;
    }

    const campanhaSalva = await this.campanhaRepository.save(novaCampanha);

    // NOTIFICAÇÃO: Disparar o evento/serviço para avisar os usuários comuns sobre as campanhas
    this.dispararNotificacaoUsuarios(campanhaSalva);

    return campanhaSalva;
  }

  // Listar todas as campanhas (Livre para qualquer usuário)
  async listarTodas(): Promise<Campanha[]> {
    return await this.campanhaRepository.find({ relations: { unidades: true } });
  }

  // Listar apenas campanhas ativas no momento (Livre para qualquer usuário)
  async listarAtivas(): Promise<Campanha[]> {
    return await this.campanhaRepository.buscarCampanhasAtivas();
  }

  // Buscar uma campanha específica pelo ID (Livre para qualquer usuário)
  async buscarPorId(id: number): Promise<Campanha> {
    return await this.campanhaRepository.buscarPorIdComUnidades(id);
  }

  // Atualizar dados de uma campanha (Apenas Agentes)
  async atualizar(id: number, updateDto: UpdateCampanhasDTO, usuarioCargo: CargosEnum): Promise<Campanha> {
    this.verificarSeEhAgente(usuarioCargo);

    const campaign = await this.buscarPorId(id);
    const { titulo, descricao, publicoAlvo, dataInicio, dataFim, local, unidadesIds } = updateDto;

    if (titulo !== undefined) campaign.titulo = titulo;
    if (descricao !== undefined) campaign.descricao = descricao;
    if (publicoAlvo !== undefined) campaign.publicoAlvo = publicoAlvo;
    if (local !== undefined) campaign.local = local;
    if (dataInicio !== undefined) campaign.dataInicio = new Date(dataInicio);
    if (dataFim !== undefined) campaign.dataFim = new Date(dataFim);

    // Se novos IDs de postos foram passados, refaz a validação forte
    if (unidadesIds !== undefined) {
      if (unidadesIds.length > 0) {
        const unidadesEncontradas = await this.unidadeSaudeRepository['ormRepository'].find({
          where: { id: In(unidadesIds) },
        });

        if (unidadesEncontradas.length !== unidadesIds.length) {
          throw new BadRequestException('Uma ou mais Unidades de Saúde informadas não existem.');
        }
        campaign.unidades = unidadesEncontradas;
      } else {
        campaign.unidades = [];
      }
    }

    return await this.campanhaRepository.save(campaign);
  }

  // Remover uma campanha do sistema (Apenas Agentes)
  async remover(id: number, usuarioCargo: CargosEnum): Promise<void> {
    this.verificarSeEhAgente(usuarioCargo);
    const campaign = await this.buscarPorId(id);
    await this.campanhaRepository.remove(campaign);
  }

  // Método privado fazendo o disparo de notificações.
  private dispararNotificacaoUsuarios(campanha: Campanha): void {
    // Envia os dados reais da campanha para o canal WebSocket
    this.notificacoesGateway.enviarNotificacaoNovaCampanha(campanha);
    console.log(`[NOTIFICAÇÃO DISPARADA] Nova campanha criada: "${campanha.titulo}". Enviando alerta para todos os cidadãos da região!`);
  }
}