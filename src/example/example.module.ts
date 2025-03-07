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
