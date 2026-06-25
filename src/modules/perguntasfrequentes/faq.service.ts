import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDTO } from './dto/create.faq.dto';
import { Faq } from './faq.entity';
import { CampanhaRepository } from '../campanha/campanhas.repository';
import { UnidadeSaudeRepository } from '../unidadesaude/unidadesaude.repository';

@Injectable()
export class FaqService {
  constructor(
    private readonly faqRepository: FaqRepository,
    private readonly campanhaRepository: CampanhaRepository,
    private readonly unidadeSaudeRepository: UnidadeSaudeRepository,
  ) {}

  async criar(createDto: CreateFaqDTO): Promise<Faq> {
    const { pergunta, resposta, campanhaId, unidadeId } = createDto;

    // Regra de validação: Não faz sentido um FAQ sem estar atrelado a nada
    if (!campanhaId && !unidadeId) {
      throw new BadRequestException(
        'O FAQ precisa estar vinculado a uma campanha ou a uma unidade de saúde.',
      );
    }

    const novoFaq = new Faq({ pergunta, resposta });

    // Se enviou campanhaId, busca a CAMPANHA (e não a unidade)
    if (campanhaId) {
      const campanha = await this.campanhaRepository.findOne({
        where: { id: campanhaId },
      });
      
      if (!campanha) {
        throw new NotFoundException(
          `Campanha com ID ${campanhaId} não foi encontrada.`,
        );
      }
      novoFaq.campanha = campanha;
    }

    // Se enviou unidadeId, faz a busca pelo postinho com segurança
    if (unidadeId) {
      const unidade = await this.unidadeSaudeRepository.findById(unidadeId);
      
      novoFaq.unidadeSaude = unidade;
    }

    return await this.faqRepository.save(novoFaq);
  }

  async listarPorCampanha(campanhaId: number): Promise<Faq[]> {
    return await this.faqRepository.buscarPorCampanha(campanhaId);
  }

  async listarPorUnidade(unidadeId: number): Promise<Faq[]> {
    return await this.faqRepository.buscarPorUnidade(unidadeId);
  }

  async remover(id: number): Promise<void> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ com ID ${id} não encontrado.`);
    }
    await this.faqRepository.remove(faq);
  }
}