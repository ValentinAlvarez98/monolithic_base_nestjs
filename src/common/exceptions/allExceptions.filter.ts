import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ExceptionFormatter } from "./exceptions.formatter";
import { FormattedException } from "./types/formattedException.type";
import { ExceptionStrategy } from "./interfaces/exceptionStrategy.interface";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

      constructor() {
      }

      catch(exception: unknown, host: ArgumentsHost) {
            
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();

            const strategy : ExceptionStrategy<unknown> = new ExceptionFormatter(exception).getStrategy();

            const formattedException : FormattedException = strategy.handle(exception, request);

            response.status(formattedException.status).json(formattedException);

      }

}