export class DatabaseConnectionError extends Error {
    reason = 'Error connecting to database';

    constructor() {
        super();

        // Only required because we are extending a built-in class.
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}