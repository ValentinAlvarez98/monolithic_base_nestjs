import { CustomLogger } from "src/global/utils";
import { FormattedException } from "../types/formattedException.type";


export interface ExceptionStrategy<T> {

      logger: CustomLogger;

      handle(exception: T, request: Request): FormattedException;

}