var Contract = artifacts.require("./BlockBounty.sol");

module.exports = function(deployer) {
	deployer.deploy(Contract);
};
