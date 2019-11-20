import React from 'react';
import caver from '../klaytn/caver'
import Delegate from './Delegate'

class Voter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proposals: [],
            selectedProposal: -1,
            isInProgress: false,
            hasLoaded: false,
            voter: null
        }
        this.refresh();
    }

    refresh = async (inProgress) => {
        const wallet = caver.klay.accounts.wallet;
        const contract = this.props.contract;
        const n = await contract.methods.getNumProposals().call();
        const v = await contract.methods.voters(wallet[0].address).call();

        let p = [];
        for (let i = 0; i < n; i++) {
            p.push(await contract.methods.proposals(i).call());
        }

        this.setState({
            proposals: p,
            selectedProposal: v.voted ? Number(v.vote) : -1,
            voter: v,
            isInProgress: inProgress,
            hasLoaded: true
        });
    }

    onSelectedProposal = (selected) => {
        this.setState({
            selectedProposal: selected
        })
    }

    onReceipt = (receipt) => {
        console.log(receipt);
        this.refresh(false);
    }

    onError = (error) => {
        alert(error.message)
        console.error(error);
        this.refresh(false);
    }

    vote = () => {
        this.setState({
            isInProgress: true
        });
        this.send(this.props.contract.methods.vote(this.state.selectedProposal), this.onReceipt, this.onError);
    }

    send = (txObj, okCallback, errCallback) => {
        const wallet = caver.klay.accounts.wallet;
        txObj.send({ from: wallet[0].address, gas: '300000' })
            .once('transactionHash', console.log)
            .once('receipt', okCallback)
            .once('error', errCallback);
    }

    render() {
        const { proposals, selectedProposal, isInProgress, hasLoaded, voter } = this.state;

        let body;
        if (!hasLoaded) {
            return <div class="container">
                <hr />
                <div>
                    <div>Loading ...</div>
                </div>
            </div>
        }
        
        if (Number(voter.weight) === 0 && !voter.voted) {
            body = <div>
                <span class="tag is-danger is-light">Not a registered voter</span>
            </div>;
        }
        else if (!isInProgress) {

            let tags = <div class="tags">
                <span class="tag">Has {voter.weight} vote(s)</span>
                {Number(voter.delegate) === 0 && <span class="tag">{voter.voted ? "Already voted" : "Has not voted"}</span>}
                {Number(voter.delegate) !== 0 && <span class="tag">Delegated to {voter.delegate}</span>}
            </div>

            let votingProposals = <div>            
                {voter.voted ?
                    <h2 class="subtitle has-text-centered">Voting result</h2> :
                    <h2 class="subtitle has-text-centered">You may vote for one of the following proposals</h2>                    
                }
                <table class="table is-hoverable is-fullwidth">
                    <thead>
                        <tr style={{ background: '#eeeeee' }}>
                            <th>Position</th>
                            <th>Item</th>
                            {voter.voted && <th>Votes</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((pr, i) => {
                            let ret;
                            if (voter.voted && Number(voter.delegate) === 0) {
                                ret = <tr key={i} class={i === selectedProposal && "is-selected"}>
                                    <td>{i + 1}</td>
                                    <td>{caver.utils.hexToUtf8(pr.name)}</td>
                                    {voter.voted && <td>{pr.voteCount}</td>}
                                </tr>
                            } else {
                                ret = 
                                <tr key={i} 
                                    onClick={() => this.onSelectedProposal(i)} 
                                    class={i === selectedProposal && Number(voter.delegate) === 0 && "is-selected"}>
                                    <td>{i + 1}</td>
                                    <td>{caver.utils.hexToUtf8(pr.name)}</td>
                                    {voter.voted && <td>{pr.voteCount}</td>}
                                </tr>
                            }
                            return (ret);
                        })}
                    </tbody>
                </table>
                {!voter.voted && <button class='button is-info is-medium is-fullwidth' onClick={this.vote}>Vote</button>}
            </div>

            body = <div>
                <h1 class="title has-text-centered">Voter Menu</h1>
                {tags}
                {votingProposals}
                <hr />
                {!voter.voted && <Delegate contract={this.props.contract} refresh={this.refresh} />}                
            </div>

        } else {
            body = <progress class="progress is-large is-primary" max="100">60%</progress>
        }

        return (
            <div class="container">
                <hr />
                {body}
            </div>
        )
    }
}

export default Voter;