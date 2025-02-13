import { Logger } from "@nestjs/common";
import { logLevels } from "../../enums/log.enum";


export class CustomLogger extends Logger {

      private name: string;

      constructor(name: string) {

            super(name);

            this.name = name;

      }

      generateLog(message: string, method: string, level?: logLevels): void {

            const log = `${message} in ${this.name} - ${method}`;

            const logLevel = level ? level : logLevels.ERROR;

            this[logLevel](log);

      }

      generateValidationsLog(message: string, service: string, method: string, level?: logLevels) : void {

            const log = `${message} in ${service} - ${method}`;

            const logLevel = level ? level : logLevels.WARN;

            this[logLevel](log);

      }

}