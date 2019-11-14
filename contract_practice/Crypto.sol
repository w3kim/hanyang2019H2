pragma solidity ^0.5.6;
contract Crypto {
    struct Record {
        uint order;
        string msg;
        bytes32 hash;
    }
    
    uint public order = 0;
    Record[] public records;
    
    function record(string memory message) public {
        records.push(Record(order++, message, simpleHash(message)));
    }
    
    function record(string memory message, bytes32 hash) public {
        records.push(Record(order++, message, hash));
    }

    function simpleHash(string memory message) public pure returns (bytes32) {
        return sha256(bytes(message));
    }
    
    // example implementation for reference only
    function hashWithNonce(uint nonce, string memory message) public pure returns (bytes32) {
        bytes memory n = new bytes(32);
        assembly { mstore(add(n, 32), nonce) }

        bytes memory m = bytes(message);
        bytes memory buffer = new bytes(m.length + n.length);
        
        uint j = 0;
        for (uint i = 0; i < n.length; i++) {
            buffer[j++] = n[i];
        }
        for (uint i = 0; i < m.length; i++) {
            buffer[j++] = m[i];
        }

        return sha256(buffer);
    }
}