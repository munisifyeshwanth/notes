import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please Enter name' })
  @IsString({ message: 'Please Enter Valid Name' })
  name: string;

  @IsEmail()
  username: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  refreshToken: string;
}
