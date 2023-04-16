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
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        description: "Test charge made by Ndũng'ũ",
        source: token
    });
    // TODO Handle charge failure. I think this assumes the Stripe API call always succeeds.
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
});

export { router as createChargeRouter };