import { Injectable, Logger,} from "@nestjs/common";
import { logLevels } from "../../enums/log.enum";
import { CustomLoggerInterface } from "./interfaces/custom.logger.interface";


@Injectable()
export class CustomLogger extends Logger implements CustomLoggerInterface {

      private level: logLevels = logLevels.ERROR;
      protected context: string = "Unknown";
      

      constructor(
            context: string = "CustomLogger",
      ) {

            super(context);

            if (context) {
                  this.setContext(context);
            }

      }

      private formatTimestamp(): string {
        
            return new Date().toLocaleString('es-UY', {

                  timeZone: 'America/Montevideo',
          
                  year: 'numeric',
          
                  month: '2-digit',
      
                  day: '2-digit',
      
                  hour: '2-digit',
      
                  minute: '2-digit',
      
                  second: '2-digit',
          
            });
        
      }


      setContext(context: string) {

            this.context = context;


      }

      setLevel(level: logLevels) {

            this.level = level;

      }

      getLevel(): logLevels {

            return this.level || logLevels.ERROR;

      }

      generateLog(message: string, level?: logLevels): void {

            if (level) {
                  this.setLevel(level);
            }
            

            const timestamp = this.formatTimestamp();

            const log = `${timestamp} - ${message} in ${this.context}`;

            const rawLevel = this.getLevel();
            
            const methodName = rawLevel.toLowerCase();
            
            if (typeof this[methodName] === 'function') {
        
                  this[methodName](log);
                  
            } else {
                  
                  this.log(log);
                  
            }
            
      }
      
}