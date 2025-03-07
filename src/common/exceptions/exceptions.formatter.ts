import { HttpException } from "@nestjs/common";
import { ExceptionStrategy } from "./interfaces/exceptionStrategy.interface";
import { CustomError } from "../utils";
import { CustomExceptionStrategy, DefaultExceptionStrategy, ErrorExceptionStrategy, HttpExceptionStrategy } from "./strategies";


export class ExceptionFormatter {

      private readonly exception: unknown;
      private strategy: ExceptionStrategy<unknown>;

      constructor(exception: unknown) {

            this.exception = exception;
            this.strategy = new DefaultExceptionStrategy();

      }

      private setStrategy(): void {

            switch (true) {

                  case this.exception instanceof HttpException: {
                        
                        this.strategy = new HttpExceptionStrategy();
                        
                        break;
                        
                  }
                        
                  case this.exception instanceof CustomError: {
                        
                        this.strategy = new CustomExceptionStrategy();
                        
                        break;
                        
                  }
                        
                  case this.exception instanceof Error: {
                        
                        this.strategy = new ErrorExceptionStrategy();
                        
                        break;
                        
                  }
                        
                  default: {
                        
                        this.strategy = new DefaultExceptionStrategy();
                        
                        break;
                        
                  }
                        
            }

      }


      getStrategy(): ExceptionStrategy<unknown> {

            this.setStrategy();

            return this.strategy;

      }

}