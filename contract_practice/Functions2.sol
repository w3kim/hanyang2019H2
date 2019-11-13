pragma solidity ^0.5.6;
contract Functions2 {
    uint x = 10;
    uint y = 20;
    
    // This is okay
    function getX() public view returns (uint) {
        return x;
    }
    
    // Won't compile since getY() is marked pure
    // function getY() public pure returns (uint) {
    //     return y;
    // }
    
    // Won't compile; workaround does not work
    // function _getX() public pure returns (uint) {
    //     return getX();   
    // }
    
    function doNotTouch() public pure returns (uint) {
        return 20;
    }
}