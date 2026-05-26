import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UnidadeSaudeService } from '@/modules/unidadesaude/unidadesaude.service';
import { CreateUnidadeSaudeDTO } from '../unidadesaude/dto/create.unidadesaude.dto';
import { UpdateUnidadeSaudeDTO } from '../unidadesaude/dto/update.unidadesaude.dto';

@Controller('unidades-saude')
export class UnidadeSaudeController {
  constructor(private readonly unidadeSaudeService: UnidadeSaudeService) {}

  @Post()
  async criar(@Body() createDto: CreateUnidadeSaudeDTO) {
    return await this.unidadeSaudeService.cadastrar(createDto);
  }

  @Get()
  async buscarTodas() {
    return await this.unidadeSaudeService.listarTodas();
  }

  // Rota de filtro por bairro ex: /unidades-saude/busca/bairro?nome=Centro
  @Get('busca/bairro')
  async buscarPorBairro(@Query('nome') bairro: string) {
    return await this.unidadeSaudeService.buscarPorBairro(bairro);
  }

  @Get(':id')
  async buscarUma(@Param('id', ParseIntPipe) id: number) {
    return await this.unidadeSaudeService.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUnidadeSaudeDTO,
  ) {
    return await this.unidadeSaudeService.atualizar(id, updateDto);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.unidadeSaudeService.deletar(id);
    return { message: 'Unidade de Saúde removida com sucesso.' };
  }
}