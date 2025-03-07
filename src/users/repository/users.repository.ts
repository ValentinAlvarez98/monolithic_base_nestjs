import { PrismaClient, User } from "@prisma/client";
import { BaseRepositoryOperationsInterface, CustomError, CustomLogger, logLevels, PaginationDto } from "src/common";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { UserDBInput } from "..";


@Injectable()
export class UserRepository extends PrismaClient implements
    BaseRepositoryOperationsInterface<User, UserDBInput, string>,
    OnModuleInit,
    OnModuleDestroy
{
  private readonly logger = new CustomLogger(UserRepository.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

      async countItems(): Promise<number> {

            const result = await this.user.count();

            return result;

      }

      async create(data: UserDBInput): Promise<User> {

            try {

                  const { hashed_password , ...rest } = data;

                  const result = await this.user.create({
                        data: {
                              ...rest,
                              password: hashed_password
                        }
                   });

                  return result;
                  
            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500, 
                        'Error creating user',
                        logLevels.ERROR
                  );

            }

      }

      async findById(id: string): Promise<User | null> {

            try {

                  const result = await this.user.findUnique({
                        where: {
                              id: id
                        }
                  });

                  return result;

            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500, 
                        'Error finding user',
                        logLevels.ERROR
                  );

            }

      }

      async findByEmail(email: string): Promise<User | null> {

            try {

                  const result = await this.user.findUnique({
                        where: {
                              email: email
                        }
                  });

                  return result;

            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500, 
                        'Error finding user by email',
                        logLevels.ERROR
                  );

            }

      }

      async findAll(pagination: PaginationDto): Promise<User[]> {

            try {

                  const { page, limit, sort, order } = pagination;

                  const result = await this.user.findMany({
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: {
                              [sort]: order.toLowerCase()
                        }
                  });

                  return result;

            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500,
                        'Error finding all users',
                        logLevels.ERROR);
            }

      }

      async updateById(id: string, data: Partial<UserDBInput>): Promise<User | null> {

            try {

                  const { hashed_password, ...rest } = data;

                  const result = await this.user.update({
                        where: {
                              id: id
                        },
                        data: {
                              ...rest,
                              password: hashed_password
                        }
                  });

                  return result;

            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500,
                        'Error updating user',
                        logLevels.ERROR
                  );

            }

      }

      async deleteById(id: string): Promise<boolean> {

            try {

                  await this.user.delete({
                        where: {
                              id: id
                        }
                  });

                  return true;

            } catch (error) {

                  const { message } = error as Error;

                  this.logger.setContext(UserRepository.name);
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(
                        500,
                        'Error deleting user',
                        logLevels.ERROR
                  );

            }
            
      }

}