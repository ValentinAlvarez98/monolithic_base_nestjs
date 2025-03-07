import { BaseServicesValidations, CustomLogger } from "src/common";


export class ExampleServiceValidations extends BaseServicesValidations {

    constructor(
        data: unknown = undefined,
        service: string = 'ExampleService',
        method: string,
        whichData: string,
        logger: CustomLogger = new CustomLogger(ExampleServiceValidations.name)
    ) {

        super(data, service, method, whichData, logger = logger);

    }

    // ADD CUSTOM VALIDATIONS HERE

}