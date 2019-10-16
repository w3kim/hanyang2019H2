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

class PrivateKeyInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privateKey: ''
        };
    }
    
    handleChange = (e) => {
        this.setState({
            privateKey: e.target.value
        });
    }

    render() {
        const { privateKey } = this.state;
        return (
            <div>
                <div>
                    <span className="label">Private Key</span>
                    <span>
                        <input 
                            placeholder="your private key starting with 0x"
                            value={this.state.privateKey}
                            onChange={this.handleChange}
                        />
                        <button className="set" onClick={() => this.props.showAddress(privateKey)}>Set</button>
                    </span>
                </div>                
            </div>
            
        );
    }
}

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privateKey: ''
        };
    }

    reloadAddress = (key) => {
        this.setState({
            privateKey: key
        });
    }

    render() {
        let account = { address: "not_set" }
        const { privateKey } = this.state;
        if (privateKey) {
            account = caver.klay.accounts.privateKeyToAccount(privateKey);
        } 

        return (
            <div>
                <PrivateKeyInput showAddress={this.reloadAddress} />
                <span>My Address: </span>
                {account.address}
            </div>
        );
    }
}

ReactDOM.render(
    <div className="App">
        <Greeting />        
        <BlockNumber />
        <Address />
        <Count />
    </div>,
    document.getElementById('root')
);
