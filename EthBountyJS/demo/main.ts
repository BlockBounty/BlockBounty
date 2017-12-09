'use strict';

const Hapi = require('hapi');
const EB = require('../ethBounty');

EB.ropsten();
EB.newBounty(0, 100, 100);

const server = new Hapi.Server();
server.connection({ port: 8089, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/api/jobs',
    handler: (request, reply) => {
        reply({ jobId: 1, controller: '1 1 +', seed: 1 });
    }
});

server.route({
    method: 'POST',
    path: '/api/results',
    handler: (request, reply) => {
        EB.contribute(0, request.headers['X-Ether-Address'], 100, error => {
            if (error) {
                return reply(error);
            }
            reply('ok');
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/wasm/{jobId}',
    handler: (request, reply) => {
        reply("0x0")
    }
})

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
