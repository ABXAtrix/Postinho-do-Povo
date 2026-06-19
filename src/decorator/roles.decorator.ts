import { SetMetadata } from '@nestjs/common';
import { CargosEnum } from '@/enums/cargos.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: CargosEnum[]) => SetMetadata(ROLES_KEY, roles);