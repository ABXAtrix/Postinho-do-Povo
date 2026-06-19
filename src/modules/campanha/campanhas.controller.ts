import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { CampanhaService } from './campanhas.service';
import { CreateCampanhasDTO } from './dto/create.campanhas.dto';
import { UpdateCampanhasDTO } from './dto/update.campanhas.dto';
import { Campanha } from './campanhas.entity';
import { CargosEnum } from '@/enums/cargos.enum';
import { Roles } from '@/decorator/roles.decorator';
import { RolesGuard } from '@/decorator/roles.guard';

@Controller('campanhas')
@UseGuards(RolesGuard)
export class CampanhaController {
  constructor(private readonly campaignService: CampanhaService) {}

  // Criar uma nova campanha (Apenas Agentes)
  @Post()
  @Roles(CargosEnum.AgenteSaude) // Define que apenas Agentes passam por aqui
  async criar(@Body() createDto: CreateCampanhasDTO): Promise<Campanha> {
    // Como o Guard já valida e barra se não for agente, o service recebe a tipagem com segurança
    return await this.campaignService.criar(createDto, CargosEnum.AgenteSaude);
  }

  // Listar todas as campanhas cadastradas (Livre)
  @Get()
  async listarTodas(): Promise<Campanha[]> {
    return await this.campaignService.listarTodas();
  }

  // Listar apenas as campanhas que estão acontecendo HOJE (Livre)
  @Get('ativas')
  async listarAtivas(): Promise<Campanha[]> {
    return await this.campaignService.listarAtivas();
  }

  // Buscar os detalhes de uma campanha específica por ID (Livre)
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Campanha> {
    return await this.campaignService.buscarPorId(id);
  }

  // Atualizar dados de uma campanha (Apenas Agentes)
  @Patch(':id')
  @Roles(CargosEnum.AgenteSaude)
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCampanhasDTO,
  ): Promise<Campanha> {
    return await this.campaignService.atualizar(id, updateDto, CargosEnum.AgenteSaude);
  }

  // Remover uma campanha do sistema (Apenas Agentes)
  @Delete(':id')
  @Roles(CargosEnum.AgenteSaude)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.campaignService.remover(id, CargosEnum.AgenteSaude);
  }
}