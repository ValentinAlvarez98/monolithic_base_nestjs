import { logLevels } from "src/common/enums/log.enum";
import { CustomError, CustomLogger } from "src/common/utils";


export class BaseServicesValidations {

      private data: unknown;
      private service: string;
      private method: string;
      private whichData: string;
      protected readonly logger: CustomLogger;

      constructor(
            data: unknown,
            service: string,
            method: string,
            whichData: string,
            logger: CustomLogger = new CustomLogger(BaseServicesValidations.name)
      ) {
            this.data = data;
            this.service = service;
            this.method = method;
            this.whichData = whichData;
            this.logger = logger;
      }

      // Getters
      getData(): unknown {

            return this.data;

      }

      getService(): string {

            return this.service;

      }

      getMethod(): string {

            return this.method;

      }

      getWhichData(): string {

            return this.whichData;

      }

      // Setters
      setData(data: unknown): void {

            this.data = data;

      }

      setService(service: string): void {

            this.service = service;

      }

      setMethod(method: string): void {

            this.method = method;

      }

      setWhichData(whichData: string): void {

            this.whichData = whichData;

      }

      // Private methods 
      protected _ensureDataExists(): void {

            if (!this.data) {

                  const message = `The ${this.whichData} is required`;
                  
                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(400, message, logLevels.ERROR);

            }

            return;

      }


      // Public methods (validations)
      pageOutOfRange(): void {

            this._ensureDataExists();

            const { page, lastPage } = this.data as { page: number, lastPage: number };

            if (page > lastPage) {

                  const message = `Page out of range`;

                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(400, message, logLevels.ERROR);

            }

            return;

      }

      notFoundData(): void {

            if (!this.data) {

                  const message = `${this.whichData} not found`;

                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(404, message);

            }

            return;

      }

      alreadyExistsData(): void {

            if (this.data) {

                  const message = `${this.whichData} already exists`;

                  this.logger.generateLog(message, logLevels.ERROR);

                  throw new CustomError(400, message, logLevels.ERROR);

            }

            return;

      }

}