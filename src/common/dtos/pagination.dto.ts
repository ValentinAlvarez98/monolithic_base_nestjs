import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";


export class PaginationDto {

      @IsOptional()
      @Type(() => Number)
      @IsInt({ message: 'Limit must be an integer' })
      @Min(1, { message: 'Limit must be greater than 0' })
      limit: number = 10;

      @IsOptional()
      @Type(() => Number)
      @IsInt({ message: 'Page must be an integer' })
      @Min(1, { message: 'Page must be greater than 0' })
      page: number = 1;

      @IsOptional()
      @IsString({ message: 'Sort must be a string' })
      @MinLength(1, { message: 'Sort must not be empty' })
      @MaxLength(255, { message: 'Sort must not be greater than 255 characters' })
      sort: string = 'id';

      @IsOptional()
      @IsIn(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' })
      order: 'ASC' | 'DESC' = 'ASC';

}