import { Request, Response, NextFunction } from "express";

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
    console.log('Something went wrong', err);
    res.status(400).send({
        message: 'Something went wrong'
    });
};