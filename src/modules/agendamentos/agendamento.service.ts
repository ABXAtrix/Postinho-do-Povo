import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AgendamentoRepository } from './agendamento.repository';
import { CreateAgendamentoDTO } from './dto/create.agendamento.dto';
import { UpdateAgendamentoDTO } from './dto/update.agendamento.dto';
import { Agendamento } from './agendamentos.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly agendamentoRepository: AgendamentoRepository,
    
    // Injetando os repositórios complementares para validação de existência
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(UnidadeSaude)
    private readonly unidadeRepository: Repository<UnidadeSaude>,
  ) {}

  // 1. Criar um novo agendamento com validações de segurança
  async criar(createDto: CreateAgendamentoDTO): Promise<Agendamento> {
    // Regra de Negócio: O usuário existe?
    const usuarioExiste = await this.userRepository.findOne({ where: { id: createDto.usuarioId } });
    if (!usuarioExiste) {
      throw new NotFoundException(`Não é possível agendar: Usuário com ID ${createDto.usuarioId} não existe.`);
    }

    // Regra de Negócio: A unidade de saúde existe?
    const unidadeExiste = await this.unidadeRepository.findOne({ where: { id: createDto.unidadeId } });
    if (!unidadeExiste) {
      throw new NotFoundException(`Não é possível agendar: Unidade de Saúde com ID ${createDto.unidadeId} não existe.`);
    }

    return await this.agendamentoRepository.create(createDto);
  }

  // 2. Buscar todos os agendamentos do sistema
  async listarTodos(): Promise<Agendamento[]> {
    return await this.agendamentoRepository.findAll();
  }

  // 3. Buscar um agendamento pelo ID
  async buscarPorId(id: number): Promise<Agendamento> {
    return await this.agendamentoRepository.findById(id);
  }

  // 4. Buscar agendamentos de um paciente específico (Histórico do Cidadão)
  async listarPorUsuario(usuarioId: number): Promise<Agendamento[]> {
    const usuarioExiste = await this.userRepository.findOne({ where: { id: usuarioId } });
    if (!usuarioExiste) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado.`);
    }
    return await this.agendamentoRepository.findByUsuarioId(usuarioId);
  }

  // 5. Buscar agendamentos de uma unidade específica (Fila do Postinho)
  async listarPorUnidade(unidadeId: number): Promise<Agendamento[]> {
    const unidadExiste = await this.unidadeRepository.findOne({ where: { id: unidadeId } });
    if (!unidadExiste) {
      throw new NotFoundException(`Unidade de Saúde com ID ${unidadeId} não encontrada.`);
    }
    return await this.agendamentoRepository.findByUnidadeId(unidadeId);
  }

  // 6. Atualizar dados ou alterar status (Ex: Mudar de 'Pendente' para 'Confirmado')
  async atualizar(id: number, updateDto: UpdateAgendamentoDTO): Promise<Agendamento> {
    // O próprio repository já joga NotFoundException se o ID não existir
    return await this.agendamentoRepository.update(id, updateDto);
  }

  // 7. Cancelar/Deletar agendamento
  async remover(id: number): Promise<void> {
    return await this.agendamentoRepository.delete(id);
  }
}