import { logLevels } from "src/global/enums/log.enum";


export class CustomError extends Error {

      public status: number;
      public message: string;
      public timestamp: string;
      public logLevel: logLevels = logLevels.FATAL;

      constructor(status: number, message: string, logLevel? : logLevels) {

            super();
            this.status = status;
            this.message = message;
            this.timestamp = new Date().toLocaleDateString();
            this.logLevel = logLevel ? logLevel : this.logLevel;

      }

}