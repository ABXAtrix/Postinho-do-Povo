import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './agendamentos.entity';
import { User } from '../user/user.entity';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';
import { AgendamentoRepository } from './agendamento.repository';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';

@Module({
  imports: [
    // Registra as entidades que este módulo manipula ou consulta
    TypeOrmModule.forFeature([Agendamento, User, UnidadeSaude]),
  ],
  controllers: [AgendamentoController],
  providers: [AgendamentoService, AgendamentoRepository],
  exports: [AgendamentoService], 
})
export class AgendamentosModule {}