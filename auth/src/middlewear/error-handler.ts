import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

/**
 * Express error handler. Express will register a function as an error handler if it has four parameters. See docs.
 * https://expressjs.com/en/guide/error-handling.html
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof RequestValidationError) {
        console.log('handling this error as a request validation error');
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    } else if (err instanceof DatabaseConnectionError) {
        console.log('handling this error as a database connection error');
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    return res.status(400).send({
        errors: [{ message: 'Something went wrong.' }]
    });
};