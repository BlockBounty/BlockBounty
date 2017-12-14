This repository contains 3 distinct projects (lumped into one repo for the sake of a hackathon)
 * Bounty Contract - The solidity source code for the deployed bounty smart contract
 * Client - The static web assets that will be used for creating bounties as a buyer and contributing as a worker
 * EthBountyJS - The source for the deployed npm library (@BlockBounty/eth-bounty) for developers to reuse our smart contract
 
 To 'build' enter the Client directory and run 
 ```
 npm install && npm start
 ```
 
 Which will compile the source and start a local web server for client development making calls to our deployed api server
 
 
