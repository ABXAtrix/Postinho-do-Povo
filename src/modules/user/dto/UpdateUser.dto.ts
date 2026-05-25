import { IsNotEmpty, IsOptional, IsString, MinLength, IsPhoneNumber, IsEnum } from 'class-validator';
import { CargosEnum } from '../../../enums/cargos.enum';

export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'O nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome?: string;

  @IsOptional()
  @IsEnum(CargosEnum, { message: 'Cargo inválido. Escolha um cargo permitido.' })
  cargo?: CargosEnum;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone informado é inválido. Use o formato com DDD.' })
  telefone?: string;

  @IsOptional()
  @IsString({ message: 'O bairro precisa ser uma string.' })
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro?: string;

  @IsOptional()
  @IsString({ message: 'A senha precisa ser uma string.' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  senha?: string;
}