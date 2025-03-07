import { Module } from '@nestjs/common';
import { UserRepository } from './repository/users.repository';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
