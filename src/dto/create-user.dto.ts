import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsUnique } from 'src/decorators/is-unique.decorator';
import { User } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUnique(User, 'name')
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User, 'email')
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
