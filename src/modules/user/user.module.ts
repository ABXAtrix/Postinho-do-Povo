import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * Módulo de Usuários (UserModule)
 * 
 * Este módulo centraliza a gestão de usuários e autenticação do "Postinho do Povo".
 * Seguindo o padrão de Monólito Modular, ele encapsula sua própria lógica de 
 * acesso ao banco (Repository), regras de negócio (Service) e rotas (Controller).
 */
@Module({
  imports: [
    // Registra a entidade User para que o TypeORM possa criar a tabela e gerenciar os dados
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    // Expõe os endpoints HTTP (POST, GET, PATCH, DELETE /usuarios)
    UserController
  ],
  providers: [
    // Registra o Repositório Customizado para isolar a camada de dados
    UserRepository, 
    // Registra o Service para conter as validações e lógica de negócio
    UserService
  ],
  exports: [
    // Exportamos o Repository e o Service para que outros módulos (ex: Agendamentos)
    // possam buscar informações de usuários sem duplicar código.
    UserRepository, 
    UserService
  ],
})
export class UserModule {}