import { CustomLogger } from "src/common/utils";
import { FormattedException } from "../types/formattedException.type";


export interface ExceptionStrategy<T> {

      logger: CustomLogger;

      handle(exception: T, request: Request): FormattedException;

}