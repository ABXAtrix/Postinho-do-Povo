import { IsNotEmpty, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'O nome precisa ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome!: string;

  // Usamos IsPhoneNumber('BR') para validar se é um número de telefone válido no Brasil
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  @IsPhoneNumber('BR', { message: 'O telefone informado é inválido. Use o formato com DDD.' })
  telefone!: string;

  @IsString({ message: 'O bairro precisa ser uma string.' })
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro!: string;

  @IsString({ message: 'A senha precisa ser uma string.' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  senha!: string;
}