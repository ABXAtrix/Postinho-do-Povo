import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { FaqRepository } from './faq.repository';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { CampanhasModule } from '../campanha/campanhas.module';
import { UnidadeSaudeModule } from '../unidadesaude/unidadesaude.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Faq]),
    
    CampanhasModule,
    UnidadeSaudeModule,
  ],
  controllers: [FaqController],
  providers: [
    FaqService, 
    FaqRepository
  ],
  exports: [
    FaqService
  ],
})
export class FaqModule {}