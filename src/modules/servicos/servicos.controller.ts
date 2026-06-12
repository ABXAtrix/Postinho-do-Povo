import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicoService } from './servicos.service';
import { CreateServicoDTO } from './dto/create.servico.dto';
import { UpdateServicoDTO } from './dto/update.servico.dto';
import { Servico } from './servicos.entity';

// Define a rota base para todos os endpoints deste controller (Ex: http://localhost:3000/servicos)
@Controller('servicos')
export class ServicoController {
  // Injeta o serviço responsável pelas regras de negócio do módulo
  constructor(private readonly servicoService: ServicoService) {}

  // Criar um novo serviço (POST /servicos)
  // Recebe o corpo da requisição (@Body) validado pelo CreateServicoDTO
  @Post()
  async criar(@Body() createServicoDto: CreateServicoDTO): Promise<Servico> {
    return await this.servicoService.criar(createServicoDto);
  }

  // Listar todos os serviços cadastrados (GET /servicos)
  @Get()
  async listarTodos(): Promise<Servico[]> {
    return await this.servicoService.listarTodos();
  }

  // Buscar um serviço específico pelo ID (GET /servicos/:id)
  // O ParseIntPipe garante que o parâmetro ':id' enviado na URL seja convertido e validado como um número
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Servico> {
    return await this.servicoService.buscarPorId(id);
  }

  // Buscar todos os serviços ofertados por uma unidade específica (GET /servicos/unidade/:unidadeId)
  // Muito útil no front-end para renderizar a lista de especialidades disponíveis de um postinho selecionado
  @Get('unidade/:unidadeId')
  async buscarPorUnidade(
    @Param('unidadeId', ParseIntPipe) unidadeId: number,
  ): Promise<Servico[]> {
    return await this.servicoService.buscarPorUnidade(unidadeId);
  }

  // Atualizar dados ou alterar os vínculos de um serviço (PATCH /servicos/:id)
  // Permite atualizações parciais enviadas no corpo da requisição através do UpdateServicoDTO
  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicoDto: UpdateServicoDTO,
  ): Promise<Servico> {
    return await this.servicoService.atualizar(id, updateServicoDto);
  }

  // Remover um serviço do catálogo do sistema (DELETE /servicos/:id)
  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.servicoService.remover(id);
  }
}