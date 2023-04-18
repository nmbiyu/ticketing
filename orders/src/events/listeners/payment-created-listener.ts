import { Message } from "node-nats-streaming";
import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@nmbiyutickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        // An order in the Complete status is in a terminal state, i.e. no further changes can be made to it. Therefore,
        // we can live with not having to emit an event for this update. However, it would be good to emit the event so
        // that downstream services with copies of order records are in a consistent state.
        order.set({ status: OrderStatus.Complete });
        msg.ack();
    }
}