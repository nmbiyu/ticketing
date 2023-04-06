import { OrderCancelledEvent, Publisher, Subjects } from "@nmbiyutickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}