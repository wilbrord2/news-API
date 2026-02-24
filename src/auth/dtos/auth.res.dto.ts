import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResV1 } from '../../__helpers__';

@ApiTags('auth')
export class AuthResDto {
  constructor(partial: Partial<AuthResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: 'string', description: 'Access token type' })
  @Expose()
  tokenType: string;

  @ApiProperty({ type: 'string', description: 'Access token expiry period' })
  @Expose()
  expiresIn: string;
}

@ApiTags('auth')
export class SignUpResDto  {
  constructor(partial: Partial<SignUpResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'User ID' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', description: 'User full name' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', description: 'User email address' })
  @Expose()
  email: string;

  @ApiProperty({ type: 'string', description: 'User role' })
  @Expose()
  role: string;

  @ApiProperty({ type: 'string', description: 'Account creation timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: 'string', description: 'Last update timestamp' })
  @Expose()
  updatedAt: Date;
}

@ApiTags('auth')
export class SignUpResponseObject {
  constructor(partial: Partial<SignUpResponseObject>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: SignUpResDto, description: 'Created user data' })
  @Expose()
  user: SignUpResDto;
}
