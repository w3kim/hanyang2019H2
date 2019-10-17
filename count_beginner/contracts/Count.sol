pragma solidity ^0.5.6;

/*
  * storage variables *
  Count contract has 2 public storage variables.

  1) count - By default, count's value is 0,
             it could increase or decrease through `plus` or `minus` function.
  2) lastParticipant - lastParticipant is last person's address
                       who sent a transaction(called plus or minus) to Count contract.
  Count contract.

  * functions *
  Count contract has 2 public functions.
  1) plus - increase `count` storage variable by 1. (+1)
  2) minus - decrease `count` storage variable by 1. (-1)
 */

contract Count {
  uint public count = 0;
  address public lastParticipant;

  function plus() public {
    count++;
    lastParticipant = msg.sender;
  }

  function minus() public {
    count--;
    lastParticipant = msg.sender;
  }
}