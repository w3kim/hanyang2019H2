pragma solidity ^0.5.6;
contract Require {
    uint public x;
    
    function setTenOrHigher(uint y) public {
        require(y >= 10, "only accepting ten or higher");
        x = y;
    }
}