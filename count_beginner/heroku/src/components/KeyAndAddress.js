import React from 'react';
import caver from '../klaytn/caver';

// Step 4
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
                <form>
                    <div class='form-group'>
                        <label for='inputKey'>Private Key</label>
                        <input
                            type='text'
                            placeholder="your private key starting with 0x"
                            value={this.state.privateKey}
                            onChange={this.handleChange}
                            id="inputKey"
                            class='form-control'
                        />                        
                    </div>
                    <button type='button' class="btn btn-primary" onClick={() => this.props.reloadAddress(privateKey)}>Set</button>
                </form>                
            </div>            
        );
    }
}

// export default PrivateKeyInput

// Step 5
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
                <hr />
                <form>
                    <div class='form-group'>
                        <label for='addressField'>My Address</label>
                        <input 
                            id='addressField'
                            type='text' 
                            class='form-control'
                            disabled
                            value={account.address}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default KeyAndAddress