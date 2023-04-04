import { Publisher, Subjects, TicketUpdatedEvent } from '@nmbiyutickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}