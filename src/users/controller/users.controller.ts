import { Body, Controller, Post } from '@nestjs/common';
import {  BaseController } from 'src/common';
import { CreateUserDto, LoginUserDto, UserDBInput, UserResponse, UsersService } from '..';

@Controller('users')
export class UsersController extends BaseController<UserResponse, UserDBInput, string>{
  
      constructor(private readonly usersService: UsersService) { 
            super(usersService);
      }

      @Post('register')
      async register(
      @Body() data: CreateUserDto
      ): Promise<UserResponse> {

            return await this.usersService.register(data);

      }
      
      @Post('login')
      async login(
      @Body() data: LoginUserDto
      ): Promise<UserResponse> {

            return await this.usersService.login(data);

      }
  
}
