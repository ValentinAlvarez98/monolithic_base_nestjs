import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { BaseController } from 'src/common';
import { ExampleDBInput, ExampleResponse } from '../interfaces';
import { CreateExampleDto, UpdateExampleDto } from '../dtos';
import { ExampleService } from '../service/example.service';

@Controller('example')
export class ExampleController extends BaseController<
    ExampleResponse,
    ExampleDBInput,
    string>
{

    constructor(private readonly exampleService: ExampleService) {
        super(exampleService);
    }

    // @Get(':id') already implemented in BaseController
    // @Get() already implemented in BaseController
    // @Delete(':id') already implemented in BaseController


    @Post('create')
    async create(
        @Body() data: CreateExampleDto
    ): Promise<ExampleResponse> {

        return await this.exampleService.create(data);

    }

    @Patch('update:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateExampleDto
    ): Promise<ExampleResponse> {

        return await this.exampleService.update(id, data);

    }



}
