import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotAuthorisedError,
    NotFoundError, OrderStatus
} from "@nmbiyutickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";

const router = express.Router();

router.post('/api/payments',
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {

    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }
    if (order!.userId !== req.currentUser!.id) {
        throw new NotAuthorisedError();
    }
    if (order!.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for a cancelled order');
    }

    await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        description: "Test charge made by Ndũng'ũ",
        source: token
    });

    res.send({ success: true });
});

export { router as createChargeRouter };