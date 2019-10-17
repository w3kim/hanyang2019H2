// BEGINNING OF deploy.js
const Caver = require('caver-js');
const caver = new Caver('https://api.baobab.klaytn.net:8651/');

const acct = caver.klay.accounts.privateKeyToAccount('0x5fe365ada739df8ff4ece807d7565be943281f860fb814b65d2378efcf3a2f7e')
caver.klay.accounts.wallet.add(acct)

// Refer to contracts/Count.sol for Solidity code
const COUNT_BYTECODE = '0x60806040526000805534801561001457600080fd5b506101d7806100246000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806306661abd1461005157806314434fa51461006f57806318b0c3fd14610079578063bfe7e4e314610083575b600080fd5b6100596100cd565b6040518082815260200191505060405180910390f35b6100776100d3565b005b610081610128565b005b61008b61017c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60005481565b60008081548092919060019003919050555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b600080815480929190600101919050555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea265627a7a72315820a64411337d6a3ec88d6690fecf46d1a5fa2d79971b1a62c7ca26bc00ca38d1c464736f6c634300050b0032';
const COUNT_ABI = [{ "constant": true, "inputs": [], "name": "count", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "minus", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "plus", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "lastParticipant", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }];

// Deploy the contract
new caver.klay.Contract(COUNT_ABI)
    .deploy({
        data: COUNT_BYTECODE,
        arguments: []
    })
    .send({
        from: acct.address,
        gas: 3000000,
        value: 0
    })
    .on('error', console.log)
    .on('transactionHash', function (hash) {
        console.log(">>> tx_hash for deployment:", hash);
    })
    .on('receipt', function (receipt) {
        console.log(">>> contract deployed at", receipt.contractAddress);
    });