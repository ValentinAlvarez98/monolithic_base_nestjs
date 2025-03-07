import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


export class CreateUserDto {

      @IsString({ message: 'Name must be a string' })
      @IsNotEmpty({ message: 'Name is required' })
      @MinLength(3, { message: 'Name must be at least 3 characters long' })
      @MaxLength(50, { message: 'Name must be at most 50 characters long' })
      name: string;

      @IsEmail({}, { message: 'Invalid email' })
      @IsNotEmpty({ message: 'Email is required' })
      @MaxLength(50, { message: 'Email must be at most 50 characters long' })
      email: string;

      @IsString({ message: 'Password must be a string' })
      @IsNotEmpty({ message: 'Password is required' })
      @MinLength(8, { message: 'Password must be at least 8 characters long' })
      @MaxLength(50, { message: 'Password must be at most 50 characters long' })
      password: string;

      @ValidateIf(o => o.password !== undefined, { message: 'Confirm password is required' })
      @IsString({ message: 'Confirm password must be a string' })
      @IsNotEmpty({ message: 'Confirm password is required' })
      @MinLength(8, { message: 'Confirm password must be at least 8 characters long' })
      @MaxLength(50, { message: 'Confirm password must be at most 50 characters long' })
      confirm_password: string;
      
}