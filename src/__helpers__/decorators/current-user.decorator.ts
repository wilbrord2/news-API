import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../enums';

export type AuthUser = {
  sub: string;
  role: Role;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | null => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as AuthUser | undefined) ?? null;
  },
);
