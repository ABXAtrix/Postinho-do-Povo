import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDTO } from './dto/create.agendamento.dto';
import { UpdateAgendamentoDTO } from './dto/update.agendamento.dto';

@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly agendamentoRepository: AgendamentoService) {}

  // 1. Rota para cadastrar um novo agendamento
  // POST
  @Post()
  async criar(@Body() createDto: CreateAgendamentoDTO) {
    return await this.agendamentoRepository.criar(createDto);
  }

  // 2. Rota para listar todos os agendamentos do sistema (Painel Geral)
  // GET
  @Get()
  async listarTodos() {
    return await this.agendamentoRepository.listarTodos();
  }

  // 3. Rota para buscar os detalhes de um agendamento específico pelo ID
  // GET
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.agendamentoRepository.buscarPorId(id);
  }

  // 4. Rota para buscar todo o histórico de agendamentos de um paciente específico
  // GET
  @Get('usuario/:usuarioId')
  async listarPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return await this.agendamentoRepository.listarPorUsuario(usuarioId);
  }

  // 5. Rota para listar a fila de agendamentos de uma unidade de saúde específica
  // GET
  @Get('unidade/:unidadeId')
  async listarPorUnidade(@Param('unidadeId', ParseIntPipe) unidadeId: number) {
    return await this.agendamentoRepository.listarPorUnidade(unidadeId);
  }

  // 6. Rota para editar dados do agendamento ou alterar o status (Confirmar/Cancelar)
  // PUT
  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAgendamentoDTO,
  ) {
    return await this.agendamentoRepository.atualizar(id, updateDto);
  }

  // 7. Rota para remover um agendamento do sistema
  // DELETE
  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number) {
    return await this.agendamentoRepository.remover(id);
  }
}