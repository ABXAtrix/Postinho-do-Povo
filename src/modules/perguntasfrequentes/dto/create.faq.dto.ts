import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateFaqDTO {
  @IsString({ message: 'A pergunta precisa ser uma string.' })
  @IsNotEmpty({ message: 'A pergunta não pode ser vazia.' })
  pergunta!: string;

  @IsString({ message: 'A resposta precisa ser uma string.' })
  @IsOptional()
  resposta?: string;

  @IsInt({ message: 'O ID da campanha precisa ser um número inteiro.' })
  @IsOptional()
  campanhaId?: number;

  @IsInt({ message: 'O ID da unidade precisa ser um número inteiro.' })
  @IsOptional()
  unidadeId?: number;
}
