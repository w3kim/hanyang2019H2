pragma solidity ^0.5.6;
contract Variables {
    uint private a;
    uint b;
    uint public c;
    
    constructor() public {
        a = 2;
        b = 4;
        c = 8;
    }
    
    function getA() public view returns (uint) {
        return a;
    }
    
    function getB() public view returns (uint) {
        return b;
    }
}

contract Child is Variables {
    // Won't compile since a is private
    // function getAA() public view returns (uint) {
    //     return a;
    // }
    
    // But this works since getA() is marked public
    function getAA() public view returns (uint) {
        return getA();
    }
    
    // This works since b is treated as an internal variable
    function getBB() public view returns (uint) {
        return b;
    }
}