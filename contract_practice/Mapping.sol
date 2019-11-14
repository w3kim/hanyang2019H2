pragma solidity ^0.5.6;
contract Mapping {
    mapping (address => uint) public balances;

    event Sent(address from, address to, uint amt);

    address owner;
    
    constructor() public {
        owner = msg.sender;
        balances[owner] = 1000000000;
    }

    function transfer(address to, uint amt) public {
        require(balances[msg.sender] >= amt, "insufficient balance");
        
        balances[owner] -= amt;
        balances[to] += amt;
        
        emit Sent(msg.sender, to, amt);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}