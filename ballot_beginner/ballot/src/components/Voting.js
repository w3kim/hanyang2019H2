import React from 'react';
import caver from '../klaytn/caver'

class Voting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proposals: [],
            selectedProposal: -1,
            voted: false,
            isVoter: false,
            isInProgress: false
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
            voted: v.voted,
            selectedProposal: v.voted ? Number(v.vote) : -1,
            isVoter: v.weight > 0 || v.voted,
            isInProgress: inProgress
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
        const { proposals, selectedProposal, voted, isVoter, isInProgress } = this.state;
        if (!isVoter) {
            return (<div>Voter only</div>);
        }
        let body;
        if (!isInProgress) {
            body = <div>
                <table class="table is-hoverable is-fullwidth">
                    <thead>
                        <tr style={{ background: '#eeeeee' }}>
                            <th>Position</th>
                            <th>Item</th>
                            {voted && <th>Votes</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((pr, i) => {
                            let ret;
                            if (voted) {
                                ret = <tr key={i} class={i === selectedProposal && "is-selected"}>
                                    <td>{i + 1}</td>
                                    <td>{caver.utils.hexToUtf8(pr.name)}</td>
                                    {voted && <td>{pr.voteCount}</td>}
                                </tr>
                            } else {
                                ret = <tr key={i} onClick={() => this.onSelectedProposal(i)} class={i === selectedProposal && "is-selected"}>
                                    <td>{i + 1}</td>
                                    <td>{caver.utils.hexToUtf8(pr.name)}</td>
                                    {voted && <td>{pr.voteCount}</td>}
                                </tr>
                            }
                            return (ret);
                        })}
                    </tbody>
                </table>
                {!voted && <button class='button is-info is-medium is-fullwidth' onClick={this.vote}>Vote</button>}
            </div>
        } else {
            body = <progress class="progress is-large is-primary" max="100">60%</progress>
        }

        return (
            <div class="container">
                <hr />
                <div>
                    <h2 class="subtitle has-text-centered">Proposals</h2>
                    {body}
                </div>
            </div>
        )
    }
}

export default Voting;