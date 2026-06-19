import { PartialType } from '@nestjs/mapped-types';
import { CreateCampanhasDTO } from '../dto/create.campanhas.dto';

export class UpdateCampanhasDTO extends PartialType(CreateCampanhasDTO) {}
