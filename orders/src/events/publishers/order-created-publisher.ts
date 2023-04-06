import { OrderCreatedEvent, Publisher, Subjects } from "@nmbiyutickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}