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
        // TEST
        // contract address: 0xFD36A83913eB69D3a2b3950507518b8a29905C6F
        // chair: 0x43ddb044e96555cd64fabde34de59712c0ee9bcdbfd927f8ede30641f9ad6bba
        //
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