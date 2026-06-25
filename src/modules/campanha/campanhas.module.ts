import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campanha } from './campanhas.entity';
import { CampanhaRepository } from './campanhas.repository';
import { CampanhaService } from './campanhas.service';
import { CampanhaController } from './campanhas.controller';
import { NotificacoesGateway } from './campanhas.gateway';
import { UnidadeSaudeModule } from '../unidadesaude/unidadesaude.module';

@Module({
  imports: [
    // Registra a entidade Campanha para o TypeORM escutar neste módulo
    TypeOrmModule.forFeature([Campanha]),

    // Importa o módulo de Unidades de Saúde para que o UnidadeSaudeRepository fique disponível aqui dentro
    UnidadeSaudeModule,
  ],
  controllers: [
    // Expõe as rotas HTTP configuradas e protegidas por cargo
    CampanhaController,
  ],
  providers: [
    // Regras de negócio do domínio de campanhas
    CampanhaService,

    // Manipulação de dados customizada (Consultas Inteligentes)
    CampanhaRepository,

    // Gateway do WebSocket encarregado de transmitir os alertas em tempo real
    NotificacoesGateway,
  ],
  exports: [
    // Caso outro módulo do monólito precise consultar campanhas no futuro
    CampanhaRepository,
    CampanhaService,
  ],
})
export class CampanhasModule {}
