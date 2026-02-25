import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../__helpers__';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async findOneByEmail(
    email: string,
  ): Promise<User | null> {
    try {
      return await this.userService.findOneByEmail(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async signup(
    name: string,
    email: string,
    hashedPassword: string,
    role: Role,
  ): Promise<Partial<User> | null> {
    try {
      const user = await this.userService.create(
        name,
        email,
        hashedPassword,
        role,
      );
    

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
