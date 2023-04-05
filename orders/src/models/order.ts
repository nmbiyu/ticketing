import mongoose from "mongoose";
import { OrderStatus } from "@nmbiyutickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    // This should have been of type TicketDoc but I could not call the build function as follows.
    // const ticket = await Ticket.findById(ticketId);
    // Order.build({
    //  ... other props
    //  ticket: ticket
    // })
    ticket: any;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    // This should have been of type TicketDoc but I could not call the build function as follows.
    // const ticket = await Ticket.findById(ticketId);
    // Order.build({
    //  ... other props
    //  ticket: ticket
    // })
    ticket: any;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
});

orderSchema.set('toJSON', {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };