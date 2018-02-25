eth-bounty   
A library for paying a pool of money to people

Before doing anything with the library, configure the module. Call `config` with an object of the form
```JSON
{
    environment: "local",
    truffleConfig: require('truffle.js'), //wherever you keep a truffle.js
    dbpath: './'
}
```
Evironment can also be "ropsten".

Then call newBounty(totalJobPayout, cb) to deploy a contract to the blockchain and to start a bounty on that contract (These are two separate transactions so it can take a while). The callback has the signature of (error) and fires when the bounty has been started on the blockchain. The jobId is returned immediately (note that jobId is not given in the finished callback. Only error is provided at that time). This action causes totalJobPayout amount of wei to fund the bounty.

Now workers can contribute. In this default configuration, work must be validated by the deployer of the contract, so only the deployer can grant contributions.
The deployer can then call contribute(jobId, contributorAddress, numberOfWorksContributed, cb). When the contract owner calls `payEveryone`, everyone is automatically paid out proportional to their contributions! Keep in mind that the deployer pays all gas for this.

Anytime after a bounty has been deployed and started, call getContractAddressForJobId(jobId, cb) to get the address of your bounty. The callback is (error, addres).
