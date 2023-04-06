import request from 'supertest';
import { app } from '../../app';
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
};

it('fetches orders for a particular user', async () => {
    // Create three tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    // Create one order as User #1
    const { body: user1Order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

    // Create two orders as user #2
    const { body: user2Order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const { body: user2Order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    // Make request to get orders for User #2
    const { body: user2Orders } = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    // Make sure we only get the orders for User #2
    expect(user2Orders.length).toEqual(2);
    expect(user2Orders[0].id).toEqual(user2Order1.id);
    expect(user2Orders[1].id).toEqual(user2Order2.id);
    expect(user2Orders[0].ticket.id).toEqual(ticket2.id);
    expect(user2Orders[1].ticket.id).toEqual(ticket3.id);
});