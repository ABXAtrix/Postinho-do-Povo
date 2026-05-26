import { BadRequestException, Injectable } from '@nestjs/common';
import { UnidadeSaudeRepository } from './unidadesaude.repository';
import { CreateUnidadeSaudeDTO } from './dto/create.unidadesaude.dto';
import { UpdateUnidadeSaudeDTO } from './dto/update.unidadesaude.dto';
import { UnidadeSaude } from './unidadesaude.entity';

@Injectable()
export class UnidadeSaudeService {
  // Injetamos o repositório customizado do próprio módulo
  constructor(private readonly unidadeSaudeRepository: UnidadeSaudeRepository) {}

  async cadastrar(createDto: CreateUnidadeSaudeDTO): Promise<UnidadeSaude> {
    // Regra de Negócio: Evitar postinhos duplicados com o mesmo nome no mesmo bairro
    const unidadesExistentes = await this.unidadeSaudeRepository.findByBairro(createDto.bairro);
    const nomeDuplicado = unidadesExistentes.some(
      (unidade) => unidade.nome.toLowerCase() === createDto.nome.toLowerCase()
    );

    if (nomeDuplicado) {
      throw new BadRequestException(
        `Já existe uma Unidade de Saúde com o nome "${createDto.nome}" cadastrada no bairro ${createDto.bairro}.`
      );
    }

    return await this.unidadeSaudeRepository.create(createDto);
  }

  async listarTodas(): Promise<UnidadeSaude[]> {
    return await this.unidadeSaudeRepository.findAll();
  }

  async buscarPorId(id: number): Promise<UnidadeSaude> {
    // O próprio repositório já lança um NotFoundException se o ID não existir
    return await this.unidadeSaudeRepository.findById(id);
  }

  async buscarPorBairro(bairro: string): Promise<UnidadeSaude[]> {
    return await this.unidadeSaudeRepository.findByBairro(bairro);
  }

  async atualizar(id: number, updateDto: UpdateUnidadeSaudeDTO): Promise<UnidadeSaude> {
    // O repositório valida a existência internamente antes de atualizar
    return await this.unidadeSaudeRepository.update(id, updateDto);
  }

  async deletar(id: number): Promise<void> {
    // O repositório valida a existência internamente antes de deletar
    await this.unidadeSaudeRepository.delete(id);
  }
}