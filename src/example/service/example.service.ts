import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { ExampleRepository } from '../repository/example.repository';
import { ExampleServiceValidations } from './example.service.validations';
import { ExampleDBInput, ExampleResponse } from '../interfaces';
import { CreateExampleDto, UpdateExampleDto } from '../dtos';

@Injectable()
export class ExampleService extends BaseService<
    ExampleRepository,
    ExampleServiceValidations,
    ExampleResponse,
    ExampleDBInput,
    string
    >{
    
    constructor(
        private readonly exampleRepository: ExampleRepository,
    ) {

        super(
            exampleRepository,
            'Example',
            new ExampleServiceValidations(
                undefined,
                'ExampleService',
                'Constructor',
                'Example'
            )
        )

    }

    async create(data: CreateExampleDto): Promise<ExampleResponse> {

        const result = await this.create(data);

        return result;

    }

    async update(id: string, data: UpdateExampleDto): Promise<ExampleResponse> {

        const result = await this.update(id, data);

        return result;

    }
    
}
