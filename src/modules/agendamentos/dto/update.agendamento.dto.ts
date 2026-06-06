import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDTO } from './create.agendamento.dto';

export class UpdateAgendamentoDTO extends PartialType(CreateAgendamentoDTO) {}