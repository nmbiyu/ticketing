import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth , validateRequest } from "@nmbiyutickets/common";
import { body } from "express-validator";

const router = express.Router();

router.post('/api/orders', [
    body('ticketId')
        .not()
        .isEmpty()
        // Verify that the incoming id is a valid mongodb id. The ticket service may not use mongodb so this is not
        // something that is typical of production systems. However, for learning purposes, we'll tolerate it.
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], requireAuth, async (req: Request, res: Response) => {
    res.send({});
});

export { router as newOrderRouter };