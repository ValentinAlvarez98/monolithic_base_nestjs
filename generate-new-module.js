#!/usr/bin/env node

/**
 * generate-module.js
 *
 * Script que, dado un nombre de módulo, crea la carpeta /src/<modulo>
 * con subcarpetas y archivos Nest.js, sustituyendo "Example" / "example"
 * por el nombre de módulo correspondiente, respetando mayúsculas y minúsculas.
 */

const fs = require('fs');
const path = require('path');

// Tomamos el nombre del módulo desde la línea de comandos
const rawModuleName = process.argv[2];

if (!rawModuleName) {
  console.error('Por favor, pasá el nombre del módulo. Ejemplo: node generate-module.js user');
  process.exit(1);
}

// Funciones para generar las variantes
// "Example" -> capitalizedModuleName
// "example" -> lowercasedModuleName
const lowercasedModuleName = rawModuleName.toLowerCase();
const capitalizedModuleName =
  rawModuleName.charAt(0).toUpperCase() + rawModuleName.slice(1).toLowerCase();

// Ruta base donde se crearán los archivos
const baseDir = path.join(__dirname, 'src', lowercasedModuleName);

// Helpers para crear carpetas y archivos
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createFile(filePath, content) {
  // Remplaza "Example" y "example" en el contenido
  let replacedContent = content
    .replace(/Example/g, capitalizedModuleName)
    .replace(/example/g, lowercasedModuleName);

  fs.writeFileSync(filePath, replacedContent, 'utf8');
  console.log(`Creado: ${filePath}`);
}

// 1) Definimos los contenidos originales como plantillas (templates)
//    Tal cual los pasaste, sin modificar, pero en string.

const controllerTemplate = `
import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { BaseController } from 'src/common';
import { ExampleDBInput, ExampleResponse } from '../interfaces';
import { CreateExampleDto, UpdateExampleDto } from '../dtos';
import { ExampleService } from '../service/example.service';

@Controller('example')
export class ExampleController extends BaseController<
    ExampleResponse,
    ExampleDBInput,
    string
> {
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
`;

const createExampleDtoTemplate = `
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateExampleDto {

    // Remove this field, it is just an exammple
    @IsString({ message: 'Some field must be a string' })
    @MinLength(3, { message: 'Some field must be at least 3 characters long' })
    @MaxLength(50, { message: 'Some field must be at most 50 characters long' })
    someField: string;

    // Add fields with validations here...

}
`;

const updateExampleDtoTemplate = `
import { PartialType } from "@nestjs/mapped-types";
import { CreateExampleDto } from "./createExample.dto";

export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    
    // If needed, add more fields with validations here...

}
`;

const dtosIndexTemplate = `
// Create ExampleDto
export * from './createExample.dto';

// Update ExampleDto
export * from './updateExample.dto';  
`;

const exampleDBInputInterfaceTemplate = `
export interface ExampleDBInput {
    
    // Remove this field, it is just an exammple
    someField: string;

    // Here you can add the fields that you need to create a new example in the database
    
} 
`;

const exampleResponseInterfaceTemplate = `
export interface ExampleResponse {
    
    // Remove this field, it is just an exammple
    someField: string;

    // Here you can add the fields that you need to return in the response

}
`;

const interfacesIndexTemplate = `
// Example DB Input
export * from './exampleDBInput.interface';

// Example Response
export * from './exampleResponse.interface';
`;

const repositoryTemplate = `
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
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }

    async countItems(): Promise<number> {
        const result = await this.example.count();
        return result;
    }

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
        }
    }

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
        }
    }

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
        }
    }

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
        }
    }

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
        }
    }
}
`;

const serviceTemplate = `
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
> {
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
        );
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
`;

const serviceValidationsTemplate = `
import { BaseServicesValidations, CustomLogger } from "src/common";

export class ExampleServiceValidations extends BaseServicesValidations {
    constructor(
        data: unknown = undefined,
        service: string = 'ExampleService',
        method: string,
        whichData: string,
        logger: CustomLogger = new CustomLogger(ExampleServiceValidations.name)
    ) {
        super(data, service, method, whichData, logger = logger);
    }

    // ADD CUSTOM VALIDATIONS HERE

}
`;

const moduleTemplate = `
import { Module } from '@nestjs/common';
import { ExampleController } from './controller/example.controller';
import { ExampleService } from './service/example.service';
import { ExampleRepository } from './repository/example.repository';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService, ExampleRepository],
  exports: [ExampleService, ExampleRepository],
})
export class ExampleModule {}
`;

// 2) Creamos las carpetas
ensureDir(baseDir); // /src/<modulo>
ensureDir(path.join(baseDir, 'controller'));
ensureDir(path.join(baseDir, 'dtos'));
ensureDir(path.join(baseDir, 'interfaces'));
ensureDir(path.join(baseDir, 'repository'));
ensureDir(path.join(baseDir, 'service'));

// 3) Creamos los archivos
createFile(
  path.join(baseDir, 'controller', `${lowercasedModuleName}.controller.ts`),
  controllerTemplate
);

createFile(
  path.join(baseDir, 'dtos', `create${capitalizedModuleName}.dto.ts`),
  createExampleDtoTemplate
);

createFile(
  path.join(baseDir, 'dtos', `update${capitalizedModuleName}.dto.ts`),
  updateExampleDtoTemplate
);

createFile(
  path.join(baseDir, 'dtos', 'index.ts'),
  dtosIndexTemplate
);

createFile(
  path.join(baseDir, 'interfaces', `${lowercasedModuleName}DBInput.interface.ts`),
  exampleDBInputInterfaceTemplate
);

createFile(
  path.join(baseDir, 'interfaces', `${lowercasedModuleName}Response.interface.ts`),
  exampleResponseInterfaceTemplate
);

createFile(
  path.join(baseDir, 'interfaces', 'index.ts'),
  interfacesIndexTemplate
);

createFile(
  path.join(baseDir, 'repository', `${lowercasedModuleName}.repository.ts`),
  repositoryTemplate
);

createFile(
  path.join(baseDir, 'service', `${lowercasedModuleName}.service.ts`),
  serviceTemplate
);

createFile(
  path.join(baseDir, 'service', `${lowercasedModuleName}.service.validations.ts`),
  serviceValidationsTemplate
);

createFile(
  path.join(baseDir, `${lowercasedModuleName}.module.ts`),
  moduleTemplate
);

console.log('¡Módulo generado con éxito!');
