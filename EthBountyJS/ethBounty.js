const contract = require('truffle-contract');
const abi = require('../BountyContract/build/contracts/BlockBounty.json');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
const myweb3 = new Web3(provider);
const BountyContractSchema = contract(abi);
BountyContractSchema.setProvider(myweb3.currentProvider);

let newBounty = (totalWorkRequired, totalJobPayout) => {
    BountyContractSchema.deployed().then(deployedInstance => {
        console.log("deployed at address", deployedInstance.address);
        return deployedInstance.createJob(totalWorkRequired, totalJobPayout, { from: myweb3.eth.accounts[0], value: totalJobPayout });
    }).then(response => {
        console.log("'starting job' tx included in block:", response.receipt.blockNumber);
    }).catch(error => {
        console.log(error);
    });
};

let contribute = (contributor, numberOfWorksContributed) => {
    BountyContractSchema.deployed().then(deployedInstance => {
        return deployedInstance.contribute(contributor, numberOfWorksContributed, {from: myweb3.eth.accounts[0]});
    }).then(response => {
        console.log(numberOfWorksContributed, "contributions credited for user", contributor);
    }).catch(error => {
        console.log(error);
    });
};

module.exports = {
    newBounty,
    contribute
};
