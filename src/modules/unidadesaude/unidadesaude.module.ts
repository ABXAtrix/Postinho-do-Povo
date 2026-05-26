import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeSaude } from './unidadesaude.entity';
import { UnidadeSaudeRepository } from '../unidadesaude/unidadesaude.repository'; 
import { UnidadeSaudeService } from '../unidadesaude/unidadesaude.service';
import { UnidadeSaudeController } from '../unidadesaude/unidadesaude.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnidadeSaude])
  ],
  controllers: [
    UnidadeSaudeController // 🌟 Registrado aqui!
  ],
  providers: [
    UnidadeSaudeRepository,
    UnidadeSaudeService
  ],
  exports: [
    TypeOrmModule,
    UnidadeSaudeRepository,
    UnidadeSaudeService
  ],
})
export class UnidadeSaudeModule {}