import { Logger } from "@nestjs/common";
import { logLevels } from "src/common/enums/log.enum";


export interface CustomLoggerInterface extends Logger {

      setContext(context: string): void;
      
      setLevel(level: logLevels): void;

      generateLog(message: string, level?: logLevels): void;

}