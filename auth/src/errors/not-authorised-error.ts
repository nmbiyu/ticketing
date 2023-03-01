import { CustomError } from "./custom-error";

export class NotAuthorisedError extends CustomError {
    statusCode = 401;

    constructor() {
        super("Not authorised");

        // Only required because we are extending a built-in class.
        Object.setPrototypeOf(this, NotAuthorisedError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: "Not authorised"
        }];
    }
}