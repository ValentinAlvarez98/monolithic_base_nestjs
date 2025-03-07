import { CustomLogger } from "src/common/utils";
import { FormattedException } from "../types/formattedException.type";
import { ExceptionStrategy } from "../interfaces/exceptionStrategy.interface";
import { logLevels } from "src/common/enums/log.enum";


export class ErrorExceptionStrategy implements ExceptionStrategy<Error> {

      logger : CustomLogger = new CustomLogger("ErrorException");

      handle(exception: Error, request: Request): FormattedException {

            const context = request.method;
            const url = request.url;
            const status = 500;
            const message = exception.message;
            const timestamp = new Date().toLocaleDateString();

            this.logger.setLevel(logLevels.FATAL);
            this.logger.setContext(context);
            this.logger.generateLog(message);
            
            return {
                  url,
                  status,
                  message,
                  timestamp
            };

      }

}