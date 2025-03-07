import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateExampleDto {

    // Remove this field, it is just an example
    @IsString({ message: 'Some field must be a string' })
    @MinLength(3, { message: 'Some field must be at least 3 characters long' })
    @MaxLength(50, { message: 'Some field must be at most 50 characters long' })
    someField: string;

    // Add fields with validations here...

}
