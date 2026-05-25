import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { CargosEnum } from '../../../enums/cargos.enum';

export class CreateUserDTO {
  @IsString({ message: 'O nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome!: string;

  @IsNotEmpty({ message: 'O cargo não pode ser vazio.' })
  @IsEnum(CargosEnum, {
    message: 'Cargo inválido. Escolha um cargo permitido.',
  })
  cargo!: CargosEnum;

  @IsOptional()
  @IsInt({ message: 'O ID da unidade precisa ser um número inteiro.' })
  unidadeId?: number;

  // Usamos IsPhoneNumber('BR') para validar se é um número de telefone válido no Brasil
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  @IsPhoneNumber('BR', {
    message: 'O telefone informado é inválido. Use o formato com DDD.',
  })
  telefone!: string;

  @IsString({ message: 'O bairro precisa ser uma string.' })
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro!: string;

  @IsString({ message: 'A senha precisa ser uma string.' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  senha!: string;
}
