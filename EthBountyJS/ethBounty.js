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
const WORK_BUFFER_SIZE = 100;

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
    db.run('CREATE TABLE IF NOT EXISTS jobs (jobId INTEGER PRIMARY KEY, address TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS unconfirmedContributions (jobId INTEGER, address TEXT, contributionCount INTEGER, PRIMARY KEY (jobId, address))');
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
    if (totalWorkRequired % WORK_BUFFER_SIZE !== 0) {
        return cb('totalWorkRequired needs to be divisible by ' + WORK_BUFFER_SIZE);
    }
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
    db.get('SELECT contributionCount FROM unconfirmedContributions WHERE jobId = ? AND address = ?', [jobId, contributor], (err, row) => {
        if (err) {
            console.log("Error getting pending contributions", err);
            cb(err);
            return;
        }
        if (!row) {
            db.run('INSERT INTO unconfirmedContributions (jobId, address, contributionCount) VALUES (?, ?, ?)', [jobId, contributor, numberOfWorksContributed], (err2, row2) => {
                if (err2) {
                    console.log("Error creating row", err);
                    cb(err);
                    return;
                }
                console.log("created row for", contributor);
                contributeIfNecessary(jobId, contributor, numberOfWorksContributed, cb);
            });
        } else {
            db.get('UPDATE unconfirmedContributions SET contributionCount = contributionCount + ? WHERE jobId = ? AND address = ?', [numberOfWorksContributed, jobId, contributor], (err2, row2) => {
                if (err2) {
                    console.log("Error updating pending contributions", err2);
                    cb(err2);
                    return;
                }
                console.log("Updated unconfirmedContributions in db");
                contributeIfNecessary(jobId, contributor, row.contributionCount + numberOfWorksContributed, cb); //WARN: this assumes that the contributonCount in the db didn't change between the first select and now
            });
        }
    });
};

let contributeIfNecessary = (jobId, contributor, numberOfWorksContributed, cb) => {
    if (numberOfWorksContributed % WORK_BUFFER_SIZE === 0) {
        db.get('SELECT jobId, address FROM JOBS WHERE jobId = ?', [jobId], (err, row) => {
            if (err) {
                console.log("Error getting job contract address", err);
                cb(err);
                return;
            }
            db.run('UPDATE unconfirmedContributions SET contributionCount = 0 WHERE jobId = ? AND address = ?', [jobId, contributor], (err2, row2) => {
                if (err2) {
                    console.log("Error clearing contributions. User not credited on blockchain", err2);
                    cb(err2);
                    return;
                }
                console.log('sending to blockchain');
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
        });
    } else {
        cb();
    }
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
