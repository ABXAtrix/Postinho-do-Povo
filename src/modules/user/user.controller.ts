import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';

@Controller('usuarios') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async criar(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.cadastrar(createUserDto);
  }

  @Get()
  async buscarTodos() {
    return await this.userService.listarTodos();
  }

  @Get(':id')
  // O ParseIntPipe garante que o parâmetro ':id' que vem como string seja convertido para number
  async buscarUm(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDTO) {
    return await this.userService.atualizar(id, updateUserDto);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deletar(id);
    return { message: 'Usuário removido com sucesso.' };
  }
}