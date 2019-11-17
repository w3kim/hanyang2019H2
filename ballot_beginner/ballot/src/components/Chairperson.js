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

        // TODO validate address
        
        this.props.contract.methods.giveRightToVote(address).send({
            from: caver.klay.accounts.wallet[0].address,
            gas: '300000'
        })
        .once('transactionHash', console.log)
        .once('receipt', this.invalidate)
        .once('error', this.invalidate);
    }

    render() {
        const { address, isChairperson, isInProgress } = this.state;
        if (!isChairperson) {
            return (
                <div>Chairperson only</div>
            )
        }

        let inputField;
        if (isInProgress) {
            inputField = <input type='text' 
                            placeholder='Klaytn address to give right to vote' 
                            onChange={ this.onAddressChange }
                            value={ address }
                            disabled />
        } else {
            inputField = <input type='text' 
                            placeholder='Klaytn address to give right to vote' 
                            onChange={ this.onAddressChange }
                            value={ address } />
        }

        return (
            <div>
                <h2>Chairperson</h2>
                <form onSubmit={ this.giveRightToVote }>
                    { inputField }
                    <input type='submit' value='Give right to vote' />
                </form>
            </div>
        )
    }
}

export default Chairperson;