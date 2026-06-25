import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe, 
  HttpCode, 
  HttpStatus, 
  UseGuards 
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDTO } from './dto/create.faq.dto';
import { Faq } from './faq.entity';
import { CargosEnum } from '../../enums/cargos.enum';
import { Roles } from '@/decorator/roles.decorator';
import { RolesGuard } from '@/decorator/roles.guard';

@Controller('faqs')
@UseGuards(RolesGuard)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // Criar uma nova pergunta frequente
  @Post()
  @Roles(CargosEnum.UsuarioComum)
  async criar(@Body() createDto: CreateFaqDTO): Promise<Faq> {
    return await this.faqService.criar(createDto);
  }

  // Listar FAQs associados a uma Campanha (Acesso Livre)
  @Get('campanha/:campanhaId')
  async listarPorCampanha(@Param('campanhaId', ParseIntPipe) campanhaId: number): Promise<Faq[]> {
    return await this.faqService.listarPorCampanha(campanhaId);
  }

  // Listar FAQs associados a um Postinho/Unidade de Saúde (Acesso Livre)
  @Get('unidade/:unidadeId')
  async listarPorUnidade(@Param('unidadeId', ParseIntPipe) unidadeId: number): Promise<Faq[]> {
    return await this.faqService.listarPorUnidade(unidadeId);
  }

  // Remover uma pergunta frequente por ID (Apenas Agentes de Saúde)
  @Delete(':id')
  @Roles(CargosEnum.AgenteSaude)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.faqService.remover(id);
  }
}