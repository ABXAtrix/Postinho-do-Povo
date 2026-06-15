import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateCampanhasDTO {
  @IsString({ message: 'O título da campanha precisa ser uma string.' })
  @IsNotEmpty({ message: 'O título da campanha não pode ser vazio.' })
  titulo!: string;

  @IsString({ message: 'A descrição da campanha precisa ser uma string.' })
  @IsNotEmpty({ message: 'A descrição da campanha não pode ser vazio.' })
  descricao!: string;

  @IsString({ message: 'O público-alvo da campanha precisa ser uma string.' })
  @IsNotEmpty({ message: 'O público-alvo da campanha não pode ser vazio.' })
  publicoAlvo!: string;

  @IsDateString(
    {},
    { message: 'A data de início precisa ser uma data válida (ISO 8601).' },
  )
  @IsNotEmpty({ message: 'A data de início não pode ser vazia.' })
  dataInicio!: string;

  @IsDateString(
    {},
    { message: 'A data de término precisa ser uma data válida (ISO 8601).' },
  )
  @IsNotEmpty({ message: 'A data de término não pode ser vazia.' })
  dataFim!: string;

  @IsString({ message: 'O local da campanha precisa ser uma string.' })
  @IsNotEmpty({ message: 'O local da campanha não pode ser vazio.' })
  local!: string;

  @IsArray({
    message: 'As unidades precisam ser enviadas em formato de lista (array).',
  })
  @IsInt({
    each: true,
    message: 'Cada ID de unidade de saúde precisa ser um número inteiro.',
  })
  @IsNotEmpty({
    message:
      'É necessário informar ao menos uma unidade de saúde para a campanha.',
  })
  unidadesIds!: number[];
}
