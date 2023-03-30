import express, { Request, Response } from "express";
import { NotFoundError } from "@nmbiyutickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    console.debug(`ticket ${ticket}`);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as showTicketRouter };