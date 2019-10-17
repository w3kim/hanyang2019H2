// Modified version of https://github.com/klaytn/countbapp/blob/master/src/components/Count.js
import React from 'react'
import caver from "../klaytn/caver"

const ABI = require("../assets/abi.json");

// Step 7
class Count extends React.Component {

    constructor() {
        super();
        // ** 1. Create contract instance **
        // ex:) new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
        // You can call contract method through this instance.
        // Now you can access the instance by `this.countContract` variable.
        this.countContract =
            process.env.REACT_APP_CONTRACT_ADDRESS && ABI &&
            new caver.klay.Contract(ABI, process.env.REACT_APP_CONTRACT_ADDRESS);

        this.state = {
            count: '',
            lastParticipant: '',
            privateKey: ''
        };

        this.wallet = caver.klay.accounts.wallet;
    }

    // exposed function
    setPrivateKey(key) {
        this.wallet.clear();
        this.wallet.add(key);
        this.setState({
            privateKey: key
        });
    }

    intervalId = null

    getCount = async () => {
        // ** 2. Call contract method (CALL) **
        // ex:) this.countContract.methods.methodName(arguments).call()
        // You can call contract method (CALL) like above.
        // For example, your contract has a method called `count`.
        // You can call it like below:
        // ex:) this.countContract.methods.count().call()
        // It returns promise, so you can access it by .then() or, use async-await.
        const count = await this.countContract.methods.count().call();
        const lastParticipant = await this.countContract.methods.lastParticipant().call();
        this.setState({
            count,
            lastParticipant,
        });
    }

    callPlus = () => {
        const walletInstance = this.wallet[0];

        // Need to integrate wallet for calling contract method.
        if (!walletInstance) return;

        // 3. ** Call contract method (SEND) **
        // ex:) this.countContract.methods.methodName(arguments).send(txObject)
        // You can call contract method (SEND) like above.
        // For example, your contract has a method called `plus`.
        // You can call it like below:
        // ex:) this.countContract.methods.plus().send({
        //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
        //   gas: '200000',
        // })
        this.countContract.methods.plus().send({
            from: walletInstance.address,
            gas: '200000',
        })
            .once('transactionHash', (txHash) => {
                console.log(`
              Sending a transaction... (Call contract's function 'plus')
              txHash: ${txHash}
              `
                )
            })
            .once('receipt', (receipt) => {
                console.log(`
              Received receipt! It means your transaction(calling plus function)
              is in klaytn block(#${receipt.blockNumber})
            `, receipt)
                this.setState({
                    txHash: receipt.transactionHash,
                })
            })
            .once('error', (error) => {
                alert(error.message)
            });
    }

    callMinus = () => {
        const walletInstance = this.wallet && this.wallet[0];

        // Need to integrate wallet for calling contract method.
        if (!walletInstance) return;

        // 3. ** Call contract method (SEND) **
        // ex:) this.countContract.methods.methodName(arguments).send(txObject)
        // You can call contract method (SEND) like above.
        // For example, your contract has a method called `minus`.
        // You can call it like below:
        // ex:) this.countContract.methods.minus().send({
        //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
        //   gas: '200000',
        // })

        // It returns event emitter, so after sending, you can listen on event.
        // Use .on('transactionHash') event,
        // : if you want to handle logic after sending transaction.
        // Use .once('receipt') event,
        // : if you want to handle logic after your transaction is put into block.
        // ex:) .once('receipt', (data) => {
        //   console.log(data)
        // })
        this.countContract.methods.minus().send({
            from: walletInstance.address,
            gas: '200000',
        })
            .once('transactionHash', (txHash) => {
                console.log(`
              Sending a transaction... (Call contract's function 'minus')
              txHash: ${txHash}
              `
                )
            })
            .once('receipt', (receipt) => {
                console.log(`
              Received receipt which means your transaction(calling minus function)
              is in klaytn block(#${receipt.blockNumber})
            `, receipt)
                this.setState({
                    txHash: receipt.transactionHash,
                })
            })
            .once('error', (error) => {
                alert(error.message)
            });
    }

    componentDidMount() {
        this.intervalId = setInterval(this.getCount, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const { lastParticipant, count, txHash, privateKey } = this.state;
        return (
            <div className="Count">
                {Number(lastParticipant) !== 0 && (
                    <div className="Count__lastParticipant">
                        last participant: {lastParticipant}
                    </div>
                )}
                <div className="Count__count">COUNT: {count}</div>
                {!privateKey && (
                    <div>
                        User must provide a private key to start
                    </div>
                )}
                {privateKey && (
                    <div>
                        <button onClick={this.callPlus}>
                            +
                        </button>
                        <button onClick={this.callMinus} disabled={count === 0}>
                            -
                        </button>
                        {txHash && (
                            <div className="Count__lastTransaction">
                                <p className="Count__lastTransactionMessage">
                                    You can check your last transaction in klaytnscope:
                                </p>
                                <a target="_blank" rel="noopener noreferrer" href={`https://baobab.scope.klaytn.com/tx/${txHash}`} className="Count__lastTransactionLink">
                                    {txHash}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default Count