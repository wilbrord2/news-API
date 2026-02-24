import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser | null {
    if (err) {
      return null;
    }

    return user ?? null;
  }
}
