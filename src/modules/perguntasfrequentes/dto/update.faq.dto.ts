import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDTO } from './create.faq.dto';

export class UpdateFaqDTO extends PartialType(CreateFaqDTO) {}