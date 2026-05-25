import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDTO } from '../modules/user/dto/CreateUser.dto';
import { UpdateUserDTO } from '../modules/user/dto/UpdateUser.dto';
import { User } from '../modules/user/user.entity';

@Injectable()
export class UserService {
  // Injetamos o nosso repositório customizado no construtor
  constructor(private readonly userRepository: UserRepository) {}

  async cadastrar(createUserDto: CreateUserDTO): Promise<User> {
    // Regra de Negócio: Não permitir telefones duplicados
    const usuarioExistente = await this.userRepository.findByTelefone(createUserDto.telefone);
    if (usuarioExistente) {
      throw new BadRequestException('Este número de telefone já está cadastrado no sistema.');
    }

    return await this.userRepository.create(createUserDto);
  }

  async listarTodos(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async buscarPorId(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async atualizar(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    // O próprio repositório já valida se o ID existe internamente
    return await this.userRepository.update(id, updateUserDto);
  }

  async deletar(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}