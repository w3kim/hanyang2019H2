const Caver = require('caver-js');
// We use Websocket here since we need to subscribe events 
const caver = new Caver('wss://api.baobab.klaytn.net:8652/');

const acct = caver.klay.accounts.wallet.add('0xdf1424179fd2f3cceaf4f1c11959f10b7c88646a1f77cbf07a551a504bc07e32');
const ADDRESS = '0x083EcB4bc5Fb0e1C535276aD7447e006Cd69a439';
const ABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amt",
				"type": "uint256"
			}
		],
		"name": "Sent",
		"type": "event"
	}
];

(async () => {
	const contract = new caver.klay.Contract(ABI, ADDRESS);
	await contract.methods.getBalance().call({ from: acct.address }, function (err, data) {
		if (err) {
			console.err(err);
		} else {
			console.log(data);
		}
	})

	await contract.methods.balances(acct.address).call({ from: acct.address }, function (err, data) {
		if (err) {
			console.err(err);
		} else {
			console.log(data);
		}
	});

	await contract.events.Sent(function (error, result) {
		console.log("event >>> ", result, error);
	});

})();

