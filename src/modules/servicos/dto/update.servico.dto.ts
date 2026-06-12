import { PartialType } from '@nestjs/mapped-types';
import { CreateServicoDTO } from './create.servico.dto';

export class UpdateServicoDTO extends PartialType(CreateServicoDTO) {}