import { CustomError, CustomLogger } from "src/common/utils";
import { ExceptionStrategy } from "../interfaces/exceptionStrategy.interface";
import { FormattedException } from "../types/formattedException.type";

export class CustomExceptionStrategy implements ExceptionStrategy<CustomError> {

      logger: CustomLogger;

      private setLogger(logger: CustomLogger) {

            this.logger = logger;

      }

      handle(exception: CustomError, request: Request): FormattedException {

            const url = request.url;
            const status = exception.status;
            const message = exception.message;
            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString();
            const timestamp = `${date} ${time}`;

            if (status >= 500) {

                  this.setLogger(new CustomLogger('CustomException'));

                  const context = request.method;
             
                  this.logger.setLevel(exception.logLevel);
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