'use strict';

const Hapi = require('hapi');
const EB = require('../ethBounty');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
const web3 = new Web3(provider);

EB.newBounty(100, 100);

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
        EB.contribute(request.headers['X-Ether-Address'], 1).then(res => {
            reply('ok');
        })
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
