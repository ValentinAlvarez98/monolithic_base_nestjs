import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/common';
import { UsersServiceValidations } from './users.service.validations';
import { CreateUserDto, LoginUserDto, UserDBInput, UserRepository, UserResponse } from '..';

@Injectable()
export class UsersService extends BaseService<
      UserRepository,
      UsersServiceValidations,
      UserResponse,
      UserDBInput,
      string
> {

      constructor(
            private readonly usersRepository: UserRepository,
      ) {

            super(
                  usersRepository,
                  'User',
                  new UsersServiceValidations(
                        undefined,
                        'UsersService',
                        'Constructor',
                        'User'
                  )
            )

      }

      private async hashPassword(password: string): Promise<string> {

            const saltOrRounds = 10;
            const hash = await bcrypt.hash(password, saltOrRounds); 
            
            return hash;

      }

      async register(data: CreateUserDto): Promise<UserResponse> {

            const existingUser = await this.repository.findByEmail(data.email);
            this.validations.setData(existingUser);
            this.validations.setMethod(this.register.name);
            this.validations.alreadyExistsData();

            const { password, confirm_password, ...rest } = data;

            const hashed_password = await this.hashPassword(password);

            const result = await this.create({
                  ...rest,
                  hashed_password
            });

            return result;

      }

      async login(data: LoginUserDto): Promise<UserResponse> {

            const { email, password } = data;

            const user = await this.repository.findByEmail(email!);
            this.validations.setData(user);
            this.validations.setMethod(this.login.name);
            this.validations.notFoundData();

            await this.validations.isValidPassword(password!, user!.password);

            const { password: _, ...rest } = user!;

            return rest;

      }

}
