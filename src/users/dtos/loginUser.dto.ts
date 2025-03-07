import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


export class LoginUserDto {

      @IsEmail({}, { message: 'Invalid email' })
      @IsNotEmpty({ message: 'Email is required' })
      @MaxLength(50, { message: 'Email must be at most 50 characters long' })
      email: string;

      @IsString({ message: 'Password must be a string' })
      @IsNotEmpty({ message: 'Password is required' })
      @MinLength(8, { message: 'Password must be at least 8 characters long' })
      @MaxLength(50, { message: 'Password must be at most 50 characters long' })
      password: string;
      
}