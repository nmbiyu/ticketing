import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@nmbiyutickets/common";
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
    '/api/tickets',
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    ],
    requireAuth, // We would like to add this before the handlers so that we fail fast since there is no point trying to
    // validate the input if the call is not authorised. However, TypeScript does not like it when I place requireAuth
    // first. TODO Investigate and fix this.
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });
        await ticket.save();

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };