import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../../__helpers__';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../__helpers__/decorators';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req?.['user'] as { role?: string } | undefined;

    if (!user?.role) {
      throw new UnauthorizedException('Missing authentication context.');
    }

    const normalizedUserRole = String(user.role).toLowerCase();
    const hasRole = requiredRoles.some(
      (requiredRole) => normalizedUserRole === requiredRole,
    );

    if (!hasRole) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
