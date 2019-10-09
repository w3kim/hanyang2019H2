import React from 'react';
import ReactDOM from 'react-dom';
import BlockNumber from './components/BlockNumber'
import Count from './components/Count'
import caver from './klaytn/caver'

class Greeting extends React.Component {
    render() {
        return (
            <div><h1>Hello, Count BApp</h1></div>
        );
    }
}

class Address extends React.Component {
    render() {
        let account = { address: "not_set" }
        if (process.env.NODE_ENV !== "production") {
            account = caver.klay.accounts.privateKeyToAccount(process.env.REACT_APP_PRIVATE_KEY);
        } else {
            // TODO securely obtain user private key
        }
        return (
            <div>
                <span>My Address: </span>
                {account.address}
            </div>            
        );
    }
}

ReactDOM.render(
    <div className="App">
        <Greeting />
        <Address />
        <BlockNumber />
        <Count />
    </div>,
    document.getElementById('root')
);
