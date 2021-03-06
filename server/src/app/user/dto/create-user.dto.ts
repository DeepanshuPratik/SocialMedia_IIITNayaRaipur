import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  firstName: string;
  lastName!: string;
  photoUrl: string;
  bio: string;
}
