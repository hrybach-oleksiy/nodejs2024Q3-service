import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private excludePassword(user: User): Omit<User, 'password'> {
    const result = { ...user };
    delete result.password;
    return result;
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(this.excludePassword);
  }

  findOne(id: string): Omit<User, 'password'> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const newUser = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);

    return this.excludePassword(newUser);
  }

  updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.excludePassword(user);
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }
}
