const contract = require('truffle-contract');
const abi = require('../BountyContract/build/contracts/BlockBounty.json');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

let newBounty = () => {
    let newContract = contract(abi);

    newContract.setProvider(provider);
    console.log("Pre-new");
    newContract.deployed().then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });;

};

module.exports = {
    newBounty
};
