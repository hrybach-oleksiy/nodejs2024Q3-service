import { ICreateUserDto } from '../user.interface';

export class CreateUserDto implements ICreateUserDto {
  login: string;
  password: string;
}
