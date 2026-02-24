import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import {
  AuthResDto,
  SignInReqDto,
  SignUpReqDto,
  SignUpResDto,
  SignUpResponseObject,
} from '../dtos';
import { HttpExceptionSchema, EVK, Role } from '../../__helpers__';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { BaseResponseDto } from 'src/__helpers__/dtos/base-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiBody({ type: SignUpReqDto })
  @ApiResponse({
    type: SignUpResDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 409 })
  async signup(@Body() body: SignUpReqDto) {
    let user: Partial<User> | null = null;

    body.fullname = body.fullname.trim();
    body.email = body.email?.trim().toLowerCase();
    body.password = body.password.trim();
    body.role = (body.role.trim().toLowerCase() as Role) || Role.Reader;

    const foundUserRecord = await this.authService.findOneByEmail(body.email);

    if (body.fullname.length < 3) {
      throw new BadRequestException('Full name should be provided');
    }

    if (body.fullname.length >= 50) {
      throw new BadRequestException(
        'Full name should not exceed 50 characters.',
      );
    }

    if (foundUserRecord)
      throw new ConflictException(
        `(${body.email}) has an account already. Please sign in.`,
      );

    user = await this.authService.signup(
      body.fullname,
      body.email,
      bcrypt.hashSync(body.password, 10),
      body.role,
    );

    if (!user) throw new InternalServerErrorException();

    return BaseResponseDto.ok(
      'User created successfully',
      new SignUpResponseObject({
        user: new SignUpResDto(user as Partial<SignUpResDto>),
      }),
    );
  }

  @Post('signin')
  @ApiBody({ type: SignInReqDto })
  @ApiResponse({
    type: AuthResDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 200 })
  async signIn(@Body() body: SignInReqDto) {
    body.email = body.email.trim().toLowerCase();
    body.password = body.password.trim();

    const foundUserRecord = await this.authService.findOneByEmail(body.email);

    if (!foundUserRecord || !foundUserRecord.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = bcrypt.compareSync(
      body.password,
      foundUserRecord.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: foundUserRecord.id,
        role: foundUserRecord.role,
      },
      {
        secret: this.configService.get(EVK.JWT_AT_SECRET),
        expiresIn: this.configService.get(EVK.JWT_AT_EXPIRED_PERIOD) || '24h',
      },
    );

    return BaseResponseDto.ok(
      'Logged in successfully',
      new AuthResDto({
        accessToken,
        tokenType: 'Bearer',
        expiresIn: this.configService.get(EVK.JWT_AT_EXPIRED_PERIOD) || '24h',
      }),
    );
  }
}
