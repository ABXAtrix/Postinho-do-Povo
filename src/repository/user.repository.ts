import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/user/user.entity'
import { CreateUserDTO } from '../modules/user/dto/CreateUser.dto';
import { UpdateUserDTO } from '../modules/user/dto/UpdateUser.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  // 1. Salvar um novo usuário
  async create(createUserDto: CreateUserDTO): Promise<User> {
    // Usamos o construtor que configuramos na entidade User
    const newUser = new User(createUserDto);
    return await this.ormRepository.save(newUser);
  }

  // 2. Buscar todos os usuários (útil para relatórios ou agentes de saúde)
  async findAll(): Promise<User[]> {
    return await this.ormRepository.find();
  }

  // 3. Buscar um usuário pelo ID
  async findById(id: number): Promise<User> {
    const user = await this.ormRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  // 4. Buscar por telefone (Crucial para o Login e validações do seu app!)
  async findByTelefone(telefone: string): Promise<User | null> {
    return await this.ormRepository.findOne({ where: { telefone } });
  }

  // 5. Atualizar os dados do usuário
  async update(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);
    
    // Mescla os dados novos com os dados antigos que vieram do banco
    Object.assign(user, updateUserDto);
    
    return await this.ormRepository.save(user);
  }

  // 6. Deletar um usuário
  async delete(id: number): Promise<void> {
    const result = await this.ormRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
  }
}