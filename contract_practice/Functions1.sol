pragma solidity ^0.5.6;
contract Functions1 {
    uint x = 100;
    
    function x1() view external returns (uint) {
        return x + 1;
    }
    
    function x2() view public returns (uint) {
        return x + 2;
    }
    
    function x3() view internal returns (uint) {
        return x + 3;
    }
    
    function x4() view private returns (uint) {
        return x + 4;
    }
    
    function _x3() view public returns (uint) {
        return x3();
    }
    
    function _x4() view public returns (uint) {
        return x4();
    }
}

contract Inherited is Functions1 {
    // Won't compile; only public and internal functions are accessible from a child contract
    // function x11() view public returns (uint) {
    //     return x1();
    // }
    
    Functions1 f1 = new Functions1();
    
    // This is okay since x1() is marked external
    function x11() view public returns (uint) {
        return f1.x1();
    }
    
    function x22() view public returns (uint) {
        return x2();
    }
    
    function x33() view public returns (uint) {
        return x3();
    }
    
    // Won't compile
    // function x44() view public returns (uint) {
    //     return x4();
    // }
}