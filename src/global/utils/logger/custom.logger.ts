import { Injectable, Logger } from "@nestjs/common";
import { logLevels } from "../../enums/log.enum";
import { CustomLoggerInterface } from "./interfaces/custom.logger.interface";


@Injectable()
export class CustomLogger extends Logger implements CustomLoggerInterface {

      private name: string;
      private timestamp: string;
      private level: logLevels = logLevels.ERROR;
      protected context: string = "Unknown";
      

      constructor(name: string) {

            super(name);

            this.timestamp = new Date().toLocaleDateString();

      }

      private setTimeStamp() {
            
            this.timestamp = new Date().toLocaleDateString();

      }

      setName(name: string) {

            this.name = name;

            Logger.overrideLogger(this);

      }

      setContext(context: string) {

            this.context = context;

      }

      setLevel(level: logLevels) {

            this.level = level;

      }

      generateLog(message: string): void {

            this.setTimeStamp();

            const log = `${this.timestamp} - ${message} in ${this.context}`;

            const logLevel = logLevels[this.level].toLowerCase();

            this[logLevel](log);

      }

}