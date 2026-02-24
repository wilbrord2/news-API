import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from './strategies';
import { User } from '../user/entities/user.entity';
import {
  AccessTokenGuard,
  OptionalAccessTokenGuard,
  RbacGuard,
} from './guards';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    OptionalAccessTokenGuard,
    RbacGuard,
  ],
  exports: [AuthService, AccessTokenGuard, OptionalAccessTokenGuard, RbacGuard],
})
export class AuthModule {}
