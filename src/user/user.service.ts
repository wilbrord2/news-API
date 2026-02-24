import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../__helpers__';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.userRepository.findOne({
        where: {
          email: email,
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          password: true,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    role: Role,
  ): Promise<Partial<User> | null> {
    try {
      const newUser = this.userRepository.create({
        name: name,
        email: email,
        role: role as Role,
        password: hashedPassword,
      });

      await this.userRepository.save(newUser);

      return await this.findOneByEmail(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Partial<User> | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
