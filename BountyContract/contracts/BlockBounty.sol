pragma solidity ^0.4.18;

contract BlockBounty {

  uint public totalWorkRequired;
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

  function createJob(uint _totalWorkRequired, uint _totalJobPayout) isOwner() payable public {
    require(_totalJobPayout == msg.value);
    totalWorkRequired = _totalWorkRequired;
    totalJobPayout = _totalJobPayout;
  }

  function contribute(address contributor, uint numberOfWorks) isOwner() public {
    require(workDoneSoFar < totalWorkRequired);
    if (!contributions[contributor].isContributor) {
      contributions[contributor].isContributor = true;
      contributors.push(contributor);
    }
    contributions[contributor].contributions += numberOfWorks;
    workDoneSoFar += numberOfWorks;
    if (workDoneSoFar >= totalWorkRequired) {
      uint extraWork = workDoneSoFar - totalWorkRequired;
      contributions[contributor].contributions -= extraWork;
      payEveryone();
    }
  }

  function payEveryone() private {
    for (uint i = 0; i < contributors.length; i++) {
      address contributor = contributors[i];
      contributor.transfer(totalJobPayout * contributions[contributor].contributions / totalWorkRequired); //WARN: integer math and fees lead to errors
    }
  }

  function destroy(address balanceRecipient) isOwner() public {
    selfdestruct(balanceRecipient);
  }
}
