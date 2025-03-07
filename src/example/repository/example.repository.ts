import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Example, PrismaClient } from '@prisma/client';
import { BaseRepositoryOperationsInterface, CustomError, CustomLogger, logLevels, PaginationDto } from 'src/common';
import { ExampleDBInput } from '../interfaces';

@Injectable()
export class ExampleRepository extends PrismaClient implements BaseRepositoryOperationsInterface<Example, ExampleDBInput, string>,
    OnModuleInit,
    OnModuleDestroy {
    
    private readonly logger = new CustomLogger(ExampleRepository.name);

    async onModuleInit(): Promise<void> {
        await this.$connect();
    };

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    };

    async countItems(): Promise<number> {

        const result = await this.example.count();

        return result;

    };

    async create(data: ExampleDBInput): Promise<Example> {

        try {

            const result = await this.example.create({
                data
            });

            return result;

        } catch (error) {

            const { message } = error as Error;

            this.logger.setContext(ExampleRepository.name);
            this.logger.generateLog(message, logLevels.ERROR);

            throw new CustomError(
                500,
                'Error creating example',
                logLevels.ERROR
            );

        };

    };

    async findById(id: string): Promise<Example | null> {

        try {
            
            const result = await this.example.findUnique({
                where: {
                    id
                }
            });

            return result;

        } catch (error) {
            
            const { message } = error as Error;

            this.logger.setContext(ExampleRepository.name);
            this.logger.generateLog(message, logLevels.ERROR);

            throw new CustomError(
                500,
                'Error finding example',
                logLevels.ERROR
            );

        };

    };

    async findAll(pagination: PaginationDto): Promise<Example[]> {

        try {

            const { page, limit, sort, order } = pagination;

            const result = await this.example.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sort]: order.toLowerCase()
                }
            });

            return result;

        } catch (error) {

            const { message } = error as Error;

            this.logger.setContext(ExampleRepository.name);
            this.logger.generateLog(message, logLevels.ERROR);

            throw new CustomError(
                500,
                'Error finding examples',
                logLevels.ERROR
            );

        };

    };

    async updateById(id: string, data: Partial<ExampleDBInput>): Promise<Example | null> {

        try {

            const result = await this.example.update({
                where: {
                    id
                },
                data
            });

            return result;

        } catch (error) {

            const { message } = error as Error;

            this.logger.setContext(ExampleRepository.name);
            this.logger.generateLog(message, logLevels.ERROR);

            throw new CustomError(
                500,
                'Error updating example',
                logLevels.ERROR
            );

        };

    };

    async deleteById(id: string): Promise<boolean> {

        try {

            await this.example.delete({
                where: {
                    id
                }
            });

            return true;

        } catch (error) {

            const { message } = error as Error;

            this.logger.setContext(ExampleRepository.name);
            this.logger.generateLog(message, logLevels.ERROR);

            throw new CustomError(
                500,
                'Error deleting example',
                logLevels.ERROR
            );

        };

    };

};
