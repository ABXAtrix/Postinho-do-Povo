import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadeSaudeDTO } from '../dto/create.unidadesaude.dto';

export class UpdateUnidadeSaudeDTO extends PartialType(CreateUnidadeSaudeDTO) {}