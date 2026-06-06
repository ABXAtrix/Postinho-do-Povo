import { IsNotEmpty, IsString, IsInt, Matches, IsEnum, IsOptional } from 'class-validator';
import { StatusAgendamentoEnum } from '@/enums/status-agendamento.enum';

export class CreateAgendamentoDTO {
  @IsInt({ message: 'O ID do usuário precisa ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  usuarioId!: number;

  @IsInt({ message: 'O ID da unidade de saúde precisa ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID da unidade de saúde é obrigatório.' })
  unidadeId!: number;

  @IsString({ message: 'O serviço precisa ser uma string.' })
  @IsNotEmpty({ message: 'O tipo de serviço não pode ser vazio.' })
  servico!: string; // Ex: "Consulta Médica", "Vacinação"

  // Valida se a string está no formato YYYY-MM-DD exigido pelo banco
  @IsString({ message: 'A data precisa ser uma string.' })
  @IsNotEmpty({ message: 'A data do agendamento é obrigatória.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato americano YYYY-MM-DD.',
  })
  data!: string;

  // Valida o formato de hora (HH:MM) de 00:00 até 23:59
  @IsString({ message: 'O horário precisa ser uma string.' })
  @IsNotEmpty({ message: 'O horário do agendamento é obrigatório.' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'O horário deve estar no formato de 24 horas (HH:MM), ex: 08:30.',
  })
  horario!: string;

  @IsOptional()
  @IsEnum(StatusAgendamentoEnum, {
    message: 'Status inválido. Escolha um status permitido.',
  })
  status?: StatusAgendamentoEnum;
}