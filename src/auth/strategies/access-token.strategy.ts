import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EVK, Role } from '../../__helpers__';
import { UserService } from '../../user/user.service';

type JwtPayload = {
  sub: string;
  role: Role;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(EVK.JWT_AT_SECRET),
    });
  }
  async validate(payload: JwtPayload) {
    const foundUserRecord = await this.userService.findOne(payload.sub);
    if (!foundUserRecord) {
      throw new UnauthorizedException("The account doesn't exist.");
    }

    return {
      sub: payload.sub,
      role: payload.role,
    };
  }
}
