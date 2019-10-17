import React from 'react';
import caver from '../klaytn/caver';

// demonstrating child -> parent call propagation via props
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
                <span className="label">Private Key</span>
                <span>
                    <input
                        placeholder="your private key starting with 0x"
                        value={this.state.privateKey}
                        onChange={this.handleChange}
                    />
                    <button className="set" onClick={() => this.props.reloadAddress(privateKey)}>Set</button>
                </span>
            </div>
        );
    }
}

// demonstrating the use of child components in a user created component
// demonstrating the use of passing functions to a child component
class KeyAndAddress extends React.Component {
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
        this.props.propagateKey(key);
    }

    render() {
        let account = { address: "not_set" }
        const { privateKey } = this.state;
        if (privateKey) {
            account = caver.klay.accounts.privateKeyToAccount(privateKey);
        }

        return (
            <div>
                <PrivateKeyInput reloadAddress={this.reloadAddress} />
                <span>My Address: </span>
                {account.address}
            </div>
        );
    }
}

export default KeyAndAddress