pragma solidity ^0.4.18;

contract BlockBounty {

  uint public totalWorkRequired;
  address public owner;
  mapping (address => uint) public contributions;

  modifier isOwner() {
      require(msg.sender == owner);
      _;
  }

  function BlockBounty() public {
    owner = msg.sender;
  }

  function createJob(uint _totalWorkRequired) isOwner() public {
    totalWorkRequired = _totalWorkRequired;
  }

  function contribute(address contributor, uint numberOfWorks) isOwner() public {
    contributions[contributor] += numberOfWorks;
  }
}
