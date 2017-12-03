const EB = require('../ethBounty');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
const web3 = new Web3(provider);

EB.newBounty(100, 100);
EB.contribute(web3.eth.accounts[1], 100);
