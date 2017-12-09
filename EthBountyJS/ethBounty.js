const truffleConfig = require('../BountyContract/truffle.js');
const contract = require('truffle-contract');
const abi = require('../BountyContract/build/contracts/BlockBounty.json');
const Web3 = require('web3');
var myweb3;
const BountyContractSchema = contract(abi);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("db.sqlite3");
db.run('CREATE TABLE IF NOT EXISTS JOBS (jobId INTEGER PRIMARY KEY, address TEXT)');

let ropsten = (cb) => {
    let newProvider = truffleConfig.networks.ropsten.provider();
    configureWithProvider(newProvider, cb);
};

let local = (cb) => {
    let newProvider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    configureWithProvider(newProvider, cb);
};

let configureWithProvider = (newProvider, cb) => {
    myweb3 = new Web3(newProvider);
    BountyContractSchema.setProvider(myweb3.currentProvider);
    myweb3.eth.getAccounts((err, accounts) => {
        BountyContractSchema.defaults({
            from: accounts[0],
            gas: 4512388, //a little below prod
            gasPrice: 100000000000 //realistic prod
        });
        cb();
    });
};

//NOTE: one time I called newBounty with the wrong number of arguments. It threw  Error: Invalid number of arguments to Solidity function. It was wrong in my js code, having nothing to do with solidity. File a bug
let newBounty = (jobId, totalWorkRequired, totalJobPayout) => {
    BountyContractSchema.new().then(deployedInstance => {
        console.log("deployed at address", deployedInstance.address);
        return Promise.all([
            db.run('INSERT INTO JOBS (jobId, address) VALUES (?, ?)', jobId, deployedInstance.address),
            deployedInstance.createJob(totalWorkRequired, totalJobPayout, { value: totalJobPayout })
        ]);
    }).then(response => {
        console.log("'starting job' tx included in block:", response[1].receipt.blockNumber);
    }).catch(error => {
        console.log(error);
    });
};

let contribute = (jobId, contributor, numberOfWorksContributed, cb) => {
    db.get('SELECT jobId, address FROM JOBS WHERE jobId = ?', [jobId], (err, row) => {
        if (err) {
            console.log("Error getting job");
            return;
        }
        BountyContractSchema.at(row.address).then(deployedInstance => {
            return deployedInstance.contribute(contributor, numberOfWorksContributed);
        }).then(response => {
            console.log(numberOfWorksContributed, "contributions credited for user", contributor);
            cb();
        }).catch(error => {
            console.log(error);
            cb(error);
        });
    });
};

module.exports = {
    newBounty,
    contribute,
    ropsten,
    local
};
