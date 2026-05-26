import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadeSaude } from './unidadesaude.entity';
import { CreateUnidadeSaudeDTO } from './dto/create.unidadesaude.dto';
import { UpdateUnidadeSaudeDTO } from './dto/update.unidadesaude.dto';

@Injectable()
export class UnidadeSaudeRepository {
  constructor(
    @InjectRepository(UnidadeSaude)
    private readonly ormRepository: Repository<UnidadeSaude>,
  ) {}

  // 1. Salvar uma nova unidade de saúde no banco
  async create(createDto: CreateUnidadeSaudeDTO): Promise<UnidadeSaude> {
    const novaUnidade = new UnidadeSaude(createDto);
    return await this.ormRepository.save(novaUnidade);
  }

  // 2. Listar todos os postinhos cadastrados
  async findAll(): Promise<UnidadeSaude[]> {
    return await this.ormRepository.find();
  }

  // 3. Buscar uma unidade específica pelo ID
  async findById(id: number): Promise<UnidadeSaude> {
    const unidade = await this.ormRepository.findOne({ where: { id } });
    if (!unidade) {
      throw new NotFoundException(`Unidade de Saúde com ID ${id} não encontrada.`);
    }
    return unidade;
  }

  // 4. Buscar unidades de saúde pelo bairro (Filtro muito bom para o usuário no app)
  async findByBairro(bairro: string): Promise<UnidadeSaude[]> {
    return await this.ormRepository.find({ where: { bairro } });
  }

  // 5. Atualizar os dados de uma unidade
  async update(id: number, updateDto: UpdateUnidadeSaudeDTO): Promise<UnidadeSaude> {
    const unidade = await this.findById(id);
    
    // Mescla os dados novos por cima dos antigos
    Object.assign(unidade, updateDto);
    
    return await this.ormRepository.save(unidade);
  }

  // 6. Remover uma unidade de saúde do sistema
  async delete(id: number): Promise<void> {
    const result = await this.ormRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unidade de Saúde com ID ${id} não encontrada.`);
    }
  }
}