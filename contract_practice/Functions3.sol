pragma solidity ^0.5.6;
contract WithFallback {
    event FallbackCalled(uint x);
    
    function () external {
        emit FallbackCalled(10);
    }
}

contract WithFallbackPayable {
    function () external payable {
        // do nothing
    }
}