import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CargosEnum } from '@/enums/cargos.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Verifica se a rota exige algum cargo específico. Se não exigir, o acesso é público (Livre!)
    const requerCargos = this.reflector.getAllAndOverride<CargosEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requerCargos) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    
    // 2. Simulando o que o JWT faria: extrair o usuário injetado na requisição
    // (Por enquanto, pegamos do header, mas simulando o objeto user do JWT)
    const cargoDoUsuario = request.headers['x-usuario-cargo'];

    if (!cargoDoUsuario) {
      throw new UnauthorizedException('Usuário não autenticado no sistema.');
    }

    const cargoTratado = decodeURIComponent(cargoDoUsuario).toUpperCase().trim() as CargosEnum;

    // 3. Verifica se o cargo do usuário está na lista de cargos permitidos para a rota
    const temPermissao = requerCargos.includes(cargoTratado);

    if (!temPermissao) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }

    // Injeta o cargo limpo na request para o Service usar
    request.user = { cargo: cargoTratado };
    return true;
  }
}