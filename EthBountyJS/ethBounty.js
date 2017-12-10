const contract = require('truffle-contract');
const abi = require('./BlockBounty.json');
const Web3 = require('web3');
var myweb3;
const BountyContractSchema = contract(abi);
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
var db;
var jobId = 0;
var dbpath;

let ropsten = (_dbpath, truffleConfig, cb) => {
    dbpath = _dbpath;
    createDb(dbpath + "ropsten.sqlite3");
    let newProvider = truffleConfig.networks.ropsten.provider();
    configureWithProvider(newProvider, cb);
};

let local = (_dbpath, cb) => {
    dbpath = _dbpath;
    createDb(dbpath + "local.sqlite3");
    let newProvider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    configureWithProvider(newProvider, cb);
};

let createDb = (dbName) => {
    db = new sqlite3.Database(dbName);
    db.run('CREATE TABLE IF NOT EXISTS JOBS (jobId INTEGER PRIMARY KEY, address TEXT)');
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
        fs.readFile(dbpath + "number.txt", 'utf8', (err, data) => {
          if (!err && data) {
            jobId = parseInt(data, 10);
          }
          cb();
        });
    });
};

let newBounty = (totalWorkRequired, totalJobPayout, cb) => {
    BountyContractSchema.new().then(deployedInstance => {
        console.log("deployed at address", deployedInstance.address);
        return Promise.all([
            db.run('INSERT INTO JOBS (jobId, address) VALUES (?, ?)', jobId, deployedInstance.address),
            deployedInstance.createJob(totalWorkRequired, totalJobPayout, { value: totalJobPayout })
        ]);
    }).then(response => {
        console.log("'starting job' tx included in block:", response[1].receipt.blockNumber);
        fs.writeFileSync(dbpath + "number.txt", ++jobId);
        cb(null, jobId - 1);
    }).catch(error => {
        console.log(error);
        cb(error);
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

let getContractAddressForJobId = (jobId, cb) => {
    db.get('SELECT jobId, address FROM JOBS WHERE jobId = ?', [jobId], (err, row) => {
        if (err) {
            console.log("Error getting job");
            return cb(err);
        }
        cb(null, row.address);
    });
};

module.exports = {
    newBounty,
    contribute,
    ropsten,
    local,
    getContractAddressForJobId
};
