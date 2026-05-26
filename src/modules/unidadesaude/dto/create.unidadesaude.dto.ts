import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateUnidadeSaudeDTO {
  @IsString({ message: 'O nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'O nome da unidade não pode ser vazio.' })
  nome!: string;

  @IsString({ message: 'O endereço precisa ser uma string.' })
  @IsNotEmpty({ message: 'O endereço não pode ser vazio.' })
  endereco!: string;

  @IsString({ message: 'O bairro precisa ser uma string.' })
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro!: string;

  // Usamos IsPhoneNumber('BR') para garantir o padrão brasileiro de telefone com DDD
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  @IsPhoneNumber('BR', {
    message: 'O telefone informado é inválido. Use o formato com DDD.',
  })
  telefone!: string;

  @IsString({ message: 'O tipo de unidade precisa ser uma string.' })
  @IsNotEmpty({ message: 'O tipo da unidade (ex: USF, UPA) não pode ser vazio.' })
  tipo!: string;

  @IsString({ message: 'O horário de funcionamento precisa ser uma string.' })
  @IsNotEmpty({ message: 'O horário de funcionamento não pode ser vazio.' })
  horarioFuncionamento!: string;
}