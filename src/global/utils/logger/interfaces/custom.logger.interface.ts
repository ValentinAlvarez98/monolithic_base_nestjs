import { Logger } from "@nestjs/common";
import { logLevels } from "src/global/enums/log.enum";


export interface CustomLoggerInterface extends Logger {

      setName(name: string): void;

      setContext(context: string): void;
      
      setLevel(level: logLevels): void;

      generateLog(message: string, level?: string): void;

}