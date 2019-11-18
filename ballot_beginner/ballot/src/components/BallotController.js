import React from 'react'
import Ballot from './Ballot'
import caver from '../klaytn/caver';

class BallotController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ballotAddress: '',
            voterKey: ''
        };
        this.ballotRef = React.createRef();
    }

    handleBallotContractAddress = (e) => {
        this.setState({
            ballotAddress: e.target.value
        });
    }

    handleVoterPrivateKey = (e) => {
        this.setState({
            voterKey: e.target.value
        })
    }

    load = () => {
        // TEST only
        // this.setState({
        //     ballotAddress: '0xFD36A83913eB69D3a2b3950507518b8a29905C6F',
        //     voterKey: '0x43ddb044e96555cd64fabde34de59712c0ee9bcdbfd927f8ede30641f9ad6bba'
        // });
        const { ballotAddress, voterKey } = this.state;
       
        if (!caver.utils.isAddress(ballotAddress)) {
            alert('Invalid contract address');
            return;
        }

        if(!caver.utils.isValidPrivateKey(voterKey)) {
            alert('Invalid private key');
            return;
        }
        
        this.ballotRef.current.setup(ballotAddress, voterKey);
    }

    render() {
        const { ballotAddress, voterKey } = this.state;
        return (
            <div>
                <h1>Ballot</h1>
                <div>
                    <span>Ballot Address</span>
                    <span>
                        <input
                            placeholder="Ballot contract address"
                            value={ ballotAddress }
                            onChange = { this.handleBallotContractAddress }
                        />
                    </span>
                </div>
                <div>
                    <span>Voter Key</span>
                    <span>
                        <input
                            placeholder="Voter private key"
                            value={ voterKey }
                            onChange = { this.handleVoterPrivateKey }
                        />
                    </span>
                </div>
                <button onClick = { this.load }>Load</button>
                <div>
                    <Ballot ref={ this.ballotRef } />
                </div>
            </div>
        )
    }
}

export default BallotController;