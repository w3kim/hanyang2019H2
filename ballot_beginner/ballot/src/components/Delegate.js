import React from 'react';
import caver from '../klaytn/caver'

class Delegate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            isInProgress: false
        }
    }

    onAddressChange = (ev) => {
        this.setState({
            address: ev.target.value
        });
    }

    invalidate = (receiptOrError) => {
        console.log(receiptOrError);
        this.setState({
            address: '',
            isInProgress: false
        });
        this.props.refresh();
    }

    delegate = (ev) => {
        ev.preventDefault();
        const { address } = this.state;
        this.setState({
            isInProgress: true
        });

        if (caver.utils.isAddress(address)) {
            this.props.contract.methods.delegate(address).send({
                from: caver.klay.accounts.wallet[0].address,
                gas: '300000'
            })
                .once('transactionHash', console.log)
                .once('receipt', this.invalidate)
                .once('error', this.invalidate);
        } else {
            alert('Invalid voter address');
            this.setState({
                isInProgress: false,
                address: ''
            });
        }

    }

    render() {
        const { address, isInProgress } = this.state;
        
        let inputField;
        if (isInProgress) {
            inputField = <input type='text'
                class="input"
                placeholder='Klaytn address you delegate your vote to'
                onChange={this.onAddressChange}
                value={address}
                disabled />
        } else {
            inputField = <input type='text'
                class="input"
                placeholder='Klaytn address you delegate your vote to'
                onChange={this.onAddressChange}
                value={address} />
        }

        return (
            <div class="container">
                <hr />
                <h2 class="subtitle has-text-centered">Or you can delegate to</h2>
                <form onSubmit={this.delegate}>
                    <div class="field">
                        <label class="label">Delegate address</label>
                        <div class="control has-icons-left has-icons-right">
                            {inputField}
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                            <span class="icon is-small is-right">
                                <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                    <input class="button is-info is-medium is-fullwidth" type='submit' value='Delegate' />
                </form>
            </div>
        )
    }
}

export default Delegate;