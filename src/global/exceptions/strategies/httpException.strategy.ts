import { HttpException } from "@nestjs/common";
import { ExceptionStrategy } from "../interfaces/exceptionStrategy.interface";
import { FormattedException } from "../types/formattedException.type";
import { CustomLogger } from "src/global/utils";
import { logLevels } from "src/global/enums/log.enum";


export class HttpExceptionStrategy implements ExceptionStrategy<HttpException> {

      logger: CustomLogger;

      private setLogger(logger: CustomLogger) {

            this.logger = logger

      }

      handle(exception: HttpException, request: Request): FormattedException {

            const url = request.url;
            const status = exception.getStatus();
            const message = exception.message;
            const timestamp = new Date().toLocaleDateString();

            if (status >= 500) {

                  this.setLogger(new CustomLogger('HttpException'));

                  const context = request.method;
                  
                  this.logger.setLevel(logLevels.FATAL);
                  this.logger.setContext(context);
                  this.logger.generateLog(message);

            }
            
            return {
                  url,
                  status,
                  message,
                  timestamp
            };

      }

}