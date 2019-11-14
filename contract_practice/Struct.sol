pragma solidity ^0.5.6;
contract StructExample {
    struct Inventory {
        string name;
        uint quantity;
    }

    Inventory[] public inven;

    function addInventory(string memory name, uint quantity) public {
        inven.push(Inventory(name, quantity));
    }
    
    function findLargestInventoryIndex() public view returns (int) {
        if (inven.length == 0) {
            return -1;
        }
        uint max = 0;
        for (uint i = 0; i < inven.length; i++) {
            if (inven[i].quantity > inven[max].quantity) {
                max = i;
            }
        }
        return int(max);
    }
}