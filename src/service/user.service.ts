import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDTO } from '../modules/user/dto/CreateUser.dto';
import { UpdateUserDTO } from '../modules/user/dto/UpdateUser.dto';
import { User } from '../modules/user/user.entity';
import { CargosEnum } from '../enums/cargos.enum';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
  // Injetamos o nosso repositório customizado no construtor
  async cadastrar(createUserDto: CreateUserDTO): Promise<User> {
    // 1. Validação de telefone duplicado (já está aí e está ótima)
    const usuarioExistente = await this.userRepository.findByTelefone(
      createUserDto.telefone,
    );
    if (usuarioExistente) {
      throw new BadRequestException(
        'Este número de telefone já está cadastrado no sistema.',
      );
    }

    // 🌟 Nova Regra: Se for Agente, OBRIGATORIAMENTE precisa de um Postinho vinculado
    if (
      createUserDto.cargo === CargosEnum.AgenteSaude &&
      !createUserDto.unidadeId
    ) {
      throw new BadRequestException(
        'Um Agente de Saúde precisa estar vinculado a uma Unidade de Saúde.',
      );
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
