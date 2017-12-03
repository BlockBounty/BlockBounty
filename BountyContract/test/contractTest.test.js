const BlockBounty = artifacts.require("./BlockBounty.sol");

contract('Starting a new job', (accounts) => {

  it("should save the amount of work.", () => {
    return BlockBounty.deployed().then((instance) => {
      blockBountyInstance = instance;
      return blockBountyInstance.createJob(100, 50, {from: accounts[0]});
    }).then(() => {
      return blockBountyInstance.totalWorkRequired.call();
    }).then((totalWorkRequired) => {
      assert.equal(totalWorkRequired, 100, "Wrong amount of work.");
    });
  });
  it("should save the total payout.", () => {
    return BlockBounty.deployed().then((instance) => {
      blockBountyInstance = instance;
      return blockBountyInstance.createJob(100, 50, {from: accounts[0]});
    }).then(() => {
      return blockBountyInstance.totalJobPayout.call();
    }).then((totalJobPayout) => {
      assert.equal(totalJobPayout, 50, "Wrong payout.");
    });
  });
});
