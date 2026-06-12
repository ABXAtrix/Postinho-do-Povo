import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from './servicos.entity';
import { ServicoRepository } from './servicos.repository';
import { ServicoService } from './servicos.service';
import { ServicoController } from './servicos.controller';
import { UnidadeSaudeModule } from '../unidadesaude/unidadesaude.module'; // Importa o módulo para usar o UnidadeSaudeRepository

@Module({
  imports: [
    // Registra a entidade Servico no TypeORM para este escopo
    TypeOrmModule.forFeature([Servico]),
    // Importa o UnidadeSaudeModule para ter acesso ao repositório de postinhos que ele exporta
    UnidadeSaudeModule,
  ],
  // Declara os controllers que pertencem a este módulo
  controllers: [ServicoController],
  // Registra o Service e o Repository customizado como provedores de dependência
  providers: [ServicoService, ServicoRepository],
  // Exporta o service caso outros módulos (como o Agendamento) precisem dele no futuro
  exports: [ServicoService],
})
export class ServicosModule {}