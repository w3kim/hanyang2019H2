import React from 'react';
import caver from '../klaytn/caver'

class Chairperson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            isChairperson: false
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

    giveRightToVote = (ev) => {
        ev.preventDefault();
    }

    render() {
        const { address, isChairperson } = this.state;
        if (!isChairperson) {
            return (
                <div>Chairperson only</div>
            )
        }
        return (
            <div>
                <h2>Chairperson</h2>
                <form onSubmit={ this.giveRightToVote }>
                    <input type='text' 
                        placeholder='Klaytn address to give right to vote' 
                        onChange={ this.onAddressChange }
                        value={ address } />
                    <input type='submit' value='Give right to vote' />
                </form>
            </div>
        )
    }
}

export default Chairperson;