
import {
  Get,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BaseService } from '../services/base.service';
import { PaginationDto } from '../dtos/pagination.dto';
import { PaginationResult } from '../types/paginationResult.type';
import { BaseControllerInterface } from '../interfaces/baseController.interface';

export abstract class BaseController<T, K, L = string | number> implements BaseControllerInterface<T, K, L> {

      constructor(protected readonly service: BaseService<any, any, T, K, L>) { }

      @Get(':id')
      async findById(@Param('id', ParseUUIDPipe) id: L): Promise<T> {

            return await this.service.findById(id);

      }

      @Get()
      async findAll(
            @Query() paginationDto: PaginationDto
      ): Promise<PaginationResult<T[]>> {

            return await this.service.findAll(paginationDto);

      }

      @Delete(':id')
      async delete(@Param('id', ParseUUIDPipe) id: L): Promise<boolean> {

            return await this.service.deleteById(id);

      }
      
}