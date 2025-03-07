import { BaseServicesValidations, CustomError, CustomLogger, logLevels } from "src/common";
import * as bcrypt from 'bcrypt';


export class UsersServiceValidations extends BaseServicesValidations {

      constructor(
            data: unknown = undefined,
            service: string = 'UsersService',
            method: string,
            whichData: string,
            logger: CustomLogger = new CustomLogger(UsersServiceValidations.name)
      ) {

            super(data, service, method, whichData, logger = logger);

      }

      // ADD CUSTOM VALIDATIONS HERE
      async isValidPassword(password: string, hashed_password: string): Promise<boolean> {

            const result = await bcrypt.compare(password, hashed_password);

            if (!result) {
                  
                  this.logger.setContext(UsersServiceValidations.name);
                  this.logger.generateLog('Password is invalid', logLevels.WARN);

                  throw new CustomError(400, 'Password is invalid', logLevels.WARN);

            }

            return result;

      }

      async isValidEmail(email: string): Promise<boolean> {

            const test = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

            if (!test) {
                  
                  this.logger.setContext(UsersServiceValidations.name);
                  this.logger.generateLog('Email is invalid', logLevels.WARN);

                  throw new CustomError(400, 'Email is invalid', logLevels.WARN);

            }

            return test;

      }

}