import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento } from './agendamentos.entity';
import { CreateAgendamentoDTO } from './dto/create.agendamento.dto';
import { UpdateAgendamentoDTO } from './dto/update.agendamento.dto';

@Injectable()
export class AgendamentoRepository {
  constructor(
    @InjectRepository(Agendamento)
    private readonly ormRepository: Repository<Agendamento>,
  ) {}

  // 1. Criar um novo agendamento no sistema
  async create(createDto: CreateAgendamentoDTO): Promise<Agendamento> {
    const novoAgendamento = new Agendamento(createDto);
    return await this.ormRepository.save(novoAgendamento);
  }

  // 2. Listar todos os agendamentos (Visão administrativa do sistema)
  async findAll(): Promise<Agendamento[]> {
    return await this.ormRepository.find({
      relations: {
        usuario: true, // 🌟 Alterado de array para formato de objeto literal
        unidade: true,
      },
    });
  }

  // 3. Buscar um agendamento específico pelo ID
  async findById(id: number): Promise<Agendamento> {
    const agendamento = await this.ormRepository.findOne({
      where: { id },
      relations: {
        usuario: true, // 🌟 Alterado de array para formato de objeto literal
        unidade: true,
      },
    });
    
    if (!agendamento) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
    return agendamento;
  }

  // 4. Buscar todos os agendamentos de um Usuário/Paciente específico (Para a tela "Meus Agendamentos" no app)
  async findByUsuarioId(usuarioId: number): Promise<Agendamento[]> {
    return await this.ormRepository.find({
      where: { usuarioId },
      relations: {
        unidade: true, // 🌟 Alterado de array para formato de objeto literal
      },
      order: { data: 'ASC', horario: 'ASC' }, // Organiza por ordem cronológica
    });
  }

  // 5. Buscar todos os agendamentos de uma Unidade de Saúde (Para o painel do Agente de Saúde ver quem vai lá hoje)
  async findByUnidadeId(unidadeId: number): Promise<Agendamento[]> {
    return await this.ormRepository.find({
      where: { unidadeId },
      relations: {
        usuario: true, // 🌟 Alterado de array para formato de objeto literal
      },
      order: { data: 'ASC', horario: 'ASC' },
    });
  }

  // 6. Atualizar um agendamento (Mudar horário, data ou atualizar o Status para Confirmado/Cancelado)
  async update(id: number, updateDto: UpdateAgendamentoDTO): Promise<Agendamento> {
    const agendamento = await this.findById(id);
    
    // Mescla as alterações por cima dos dados antigos
    Object.assign(agendamento, updateDto);
    
    return await this.ormRepository.save(agendamento);
  }

  // 7. Remover um agendamento do banco
  async delete(id: number): Promise<void> {
    const result = await this.ormRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
  }
}