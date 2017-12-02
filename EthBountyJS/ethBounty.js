const contract = require('truffle-contract');
const abi = require('../BountyContract/build/contracts/BlockBounty.json');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const myweb3 = new Web3(provider);

let newBounty = () => {
    let newContract = contract(abi);
    newContract.setProvider(myweb3.currentProvider);
    console.log("Pre-new");
    newContract.deployed().then(res => {
        console.log("win");
    }).catch(error => {
        console.log(error);
    });

};

module.exports = {
    newBounty
};
