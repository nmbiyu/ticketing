import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222' // NATS server running in the k8s cluster.
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    // To publish data to the nats streaming server, our Object needs to be converted to JSON.
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log('Event published');
    });
});