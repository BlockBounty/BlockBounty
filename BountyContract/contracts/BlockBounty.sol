pragma solidity ^0.4.18;

contract BlockBounty {

  uint public totalJobPayout;
  uint public workDoneSoFar;
  address public owner;
  mapping (address => Contribution) public contributions;
  address[] public contributors;

  struct Contribution {
    uint contributions;
    bool isContributor;
  }

  //TOOD: modifier to prevent anything from happening once the job is done

  modifier isOwner() {
      require(msg.sender == owner);
      _;
  }

  function BlockBounty() public {
    owner = msg.sender;
  }

  function createJob(uint _totalJobPayout) isOwner() payable public {
    require(_totalJobPayout == msg.value);
    totalJobPayout = _totalJobPayout;
  }

  function contribute(address contributor, uint numberOfWorks) isOwner() public {
    if (!contributions[contributor].isContributor) {
      contributions[contributor].isContributor = true;
      contributors.push(contributor);
    }
    contributions[contributor].contributions += numberOfWorks;
    workDoneSoFar += numberOfWorks;
  }

  function payEveryone() isOwner() public {
    for (uint i = 0; i < contributors.length; i++) {
      address contributor = contributors[i];
      contributor.transfer(totalJobPayout * contributions[contributor].contributions / workDoneSoFar); //WARN: integer math leads to errors
    }
  }

  function destroy(address balanceRecipient) isOwner() public {
    selfdestruct(balanceRecipient);
  }
}
