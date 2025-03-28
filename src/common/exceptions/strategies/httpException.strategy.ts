import { HttpException } from "@nestjs/common";
import { ExceptionStrategy } from "../interfaces/exceptionStrategy.interface";
import { FormattedException } from "../types/formattedException.type";
import { CustomLogger } from "src/common/utils";
import { logLevels } from "src/common/enums/log.enum";


export class HttpExceptionStrategy implements ExceptionStrategy<HttpException> {

      logger: CustomLogger;

      private setLogger(logger: CustomLogger) {

            this.logger = logger

      }

      handle(exception: HttpException, request: Request): FormattedException {

            const url = request.url;
            const status = exception.getStatus();
            const message = typeof exception.getResponse() === 'object' ? exception.getResponse()['message'] : exception.getResponse();
            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString();
            const timestamp = `${date} ${time}`;

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