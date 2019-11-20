import React from 'react'
import Ballot from './Ballot'
import caver from '../klaytn/caver';

class BallotController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ballotAddress: '0x70eE404C9461Cc448435d9e586eAdC80BA757522',
            voterKey: '',
            isInvalidBallotEntered: false,
            isInvalidVoterKeyEntered: false
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
        const { ballotAddress, voterKey } = this.state;

        this.setState({
            isInvalidBallotEntered: !caver.utils.isAddress(ballotAddress),
            isInvalidVoterKeyEntered: !caver.utils.isValidPrivateKey(voterKey)
        })

        const { isInvalidBallotEntered, isInvalidVoterKeyEntered } = this.state;
        if (isInvalidBallotEntered || isInvalidVoterKeyEntered) return;

        this.ballotRef.current.setup(ballotAddress, voterKey);
    }

    render() {
        const { ballotAddress, voterKey, isInvalidBallotEntered, isInvalidVoterKeyEntered } = this.state;
        return (
            <div class="section">
                <div class="container">
                    <div class="field">
                        <label class="label">Ballot Address (try 0x70eE404C9461Cc448435d9e586eAdC80BA757522)</label>
                        <div class="control has-icons-left">
                            <input
                                class="input"
                                type="text"
                                placeholder="Ballot contract address"
                                value={ballotAddress}
                                onChange={this.handleBallotContractAddress}
                            />
                            <span class="icon is-small is-left">
                                <i class="fas fa-poll"></i>
                            </span>
                        </div>
                        {isInvalidBallotEntered &&
                            <span><p class="is-size-7 has-text-danger">Invalid ballot address entered</p></span>}
                    </div>

                    <div class="field">
                        <label class="label">Voter Key</label>
                        <div class="control has-icons-left">
                            <input
                                class="input is-success"
                                type="text"
                                placeholder="Voter private key"
                                value={voterKey}
                                onChange={this.handleVoterPrivateKey}
                            />
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                        {isInvalidVoterKeyEntered && 
                            <span><p class="is-size-7 has-text-danger">Invalid voter key entered</p></span>}
                    </div>
                    <button class='button is-info is-medium is-fullwidth' onClick={this.load}>Load</button>
                </div>
                <Ballot ref={this.ballotRef} />
            </div>
        )
    }
}

export default BallotController;