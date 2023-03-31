import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222' // NATS server running in the k8s cluster.
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');
});