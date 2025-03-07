import { CustomLogger } from "src/common/utils";
import { FormattedException } from "../types/formattedException.type";
import { ExceptionStrategy } from "../interfaces/exceptionStrategy.interface";
import { logLevels } from "src/common/enums/log.enum";


export class DefaultExceptionStrategy implements ExceptionStrategy<unknown> {

      logger : CustomLogger = new CustomLogger("DefaultException");

      handle(exception: unknown, request: Request): FormattedException {

            const context = request.method;
            const url = request.url;
            const status = 500;
            const message = 'Internal Server Error';
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