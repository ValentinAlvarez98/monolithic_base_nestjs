import { PartialType } from "@nestjs/mapped-types";
import { CreateExampleDto } from "./createExample.dto";

export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    
    // If needed, add more fields with validations here...

}