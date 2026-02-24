import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/__helpers__/enums/role.enum';

@ApiTags('auth')
export class SignUpReqDto {
  @ApiProperty({
    type: 'string',
    description: 'full name of the new user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Full name should be provided' })
  @MaxLength(50, { message: 'Full name should not exceed 50 characters.' })
  @Matches(/^(?!\d+$)[a-zA-Z\s]+$/, {
    message: 'Full name should contain only alphabets and spaces.',
  })
  fullname: string;

  @ApiProperty({ type: 'string', description: 'user email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email format is invalid',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Password user entered to set for the account',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/,
    {
      message:
        'Password should be at least 8 characters long and should include at least one UPPER case letter, one lower case letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'Role of the user, either reader or author',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Role must be either reader or author',
  })
  role: Role;
}

@ApiTags('auth')
export class SignInReqDto {
  @ApiProperty({
    type: 'string',
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Password user entered when setting the account',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password should be provided' })
  @MaxLength(255)
  password: string;
}
