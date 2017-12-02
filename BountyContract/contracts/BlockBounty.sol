pragma solidity ^0.4.18;

contract BlockBounty {

  address public owner;
  mapping (address => uint) public contributions;

  modifier isOwner() {
      require(msg.sender == owner);
      _;
  }

  function BlockBounty() public {
    owner = msg.sender;
  }

  function createJob(uint totalWorkRequired) isOwner() public {

  }

  function contribute(address contributor, uint numberOfWorks) isOwner() public {

  }
}
