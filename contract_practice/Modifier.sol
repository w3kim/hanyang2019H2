pragma solidity ^0.5.6;
contract Modifier {
    uint public x = 10;
    uint public order = 0;
    address payable owner;


    event Called(uint order);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this");
        _;
    }

    modifier logOrder() {
        _;
        emit Called(order++);
    }

    constructor() public {
        owner = msg.sender;
    }

    function getX() public logOrder returns (uint) {
        return x;
    }

    function endContract() public onlyOwner {
        selfdestruct(owner);
    }
}