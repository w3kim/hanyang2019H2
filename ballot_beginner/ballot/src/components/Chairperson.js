import React from 'react';
import caver from '../klaytn/caver'

class Chairperson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            isChairperson: false,
            isInProgress: false
        }
        this.isChairperson();
    }

    isChairperson = async () => {
        const wallet = caver.klay.accounts.wallet;
        const chairperson = await this.props.contract.methods.chairperson().call();

        this.setState({
            isChairperson: wallet[0].address === chairperson.toLowerCase()
        });
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
    }

    giveRightToVote = (ev) => {
        ev.preventDefault();
        const { address } = this.state;
        this.setState({
            isInProgress: true
        });

        if (caver.utils.isAddress(address)) {
            this.props.contract.methods.giveRightToVote(address).send({
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
        const { address, isChairperson, isInProgress } = this.state;
        if (!isChairperson) {
            return (
                <div>
                    <hr />
                    <p class="has-text-centered is-warning">Chairperson only</p>
                </div>
            )
        }

        let inputField;
        if (isInProgress) {
            inputField = <input type='text'
                class="input"
                placeholder='Klaytn address to give right to vote'
                onChange={this.onAddressChange}
                value={address}
                disabled />
        } else {
            inputField = <input type='text'
                class="input"
                placeholder='Klaytn address to give right to vote'
                onChange={this.onAddressChange}
                value={address} />
        }

        return (
            <div class="container">
                <hr />
                <h2 class="subtitle has-text-centered">Chairperson Menu</h2>
                <form onSubmit={this.giveRightToVote}>
                    <div class="field">
                        <label class="label">New voter address</label>
                        <div class="control has-icons-left has-icons-right">
                            {inputField}
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                            <span class="icon is-small is-right">
                                <i class="fas fa-plus-square"></i>
                            </span>
                        </div>
                    </div>
                    <input class="button is-info is-medium is-fullwidth" type='submit' value='Give right to vote' />
                </form>
            </div>
        )
    }
}

export default Chairperson;