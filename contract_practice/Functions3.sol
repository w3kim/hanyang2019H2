pragma solidity ^0.5.6;
contract WithFallback {
    event FallbackCalled(uint x);
    
    function () external {
        emit FallbackCalled(10);
    }
}

contract WithFallbackPayable {
    event FallbackCalled(uint amount);

    function () external payable {
        emit FallbackCalled(msg.value);
    }
}