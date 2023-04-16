import { PaymentCreatedEvent, Publisher, Subjects } from "@nmbiyutickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}