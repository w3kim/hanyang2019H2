import React from 'react';
import caver from '../klaytn/caver'
import Voter from './Voter'
import Chairperson from './Chairperson';

const ABI = require("../assets/ballot_abi.json");

class Ballot extends React.Component {
    state = {
        contractAddress: '',
        voterKey: ''
    }

    setup(contractAddress, voterKey) {
        caver.klay.accounts.wallet.clear();
        this.setState({
            contractAddress: contractAddress,
            voterKey: voterKey
        });
    }

    render() {
        const { contractAddress, voterKey } = this.state;
        const contract = new caver.klay.Contract(ABI, contractAddress);
        let voterAcct = null;
        try {
            voterAcct = caver.klay.accounts.wallet.add(voterKey);
        } catch(e) {
            // empty
        }

        return (
            <div>
                <div>
                    {contractAddress && voterAcct && <Voter 
                        contract={ contract }
                    />}
                    {contractAddress && voterAcct && <Chairperson
                        contract={ contract }
                    />}
                </div>
            </div>
        )
    }
}

export default Ballot;