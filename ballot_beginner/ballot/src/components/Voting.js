import React from 'react';
import caver from '../klaytn/caver'

class Voting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proposals: [],
            selectedProposal: -1,
            voted: false
        }
        this.refresh();
    }

    refresh = async () => {
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
            voted: v.voted
        });
    }

    onSelectedProposal = (ev) => {
        this.setState({
            selectedProposal: ev.target.value
        })
    }

    vote = (ev) => {
        ev.preventDefault();
        const { selectedProposal } = this.state;
        const refresh = this.refresh;
        this.send(this.props.contract.methods.vote(selectedProposal), function(receipt) {
            refresh();
        });
    }

    send = (txObj, callback) => {
        const wallet = caver.klay.accounts.wallet;
        txObj.send({
            from: wallet[0].address,
            gas: '300000'
        })
        .once('transactionHash', console.log)
        .once('receipt', callback)
        .once('error', (error) => {
            alert(error.message)
            console.error(error);
        });
    }

    render() {
        const { proposals, selectedProposal, voted } = this.state;
        return (
            <div>
                <h2>Voting</h2>
                <div>
                    <form onSubmit={ this.vote }>
                        { proposals.map((pr, i) => {
                            let sel = <input type="radio" value={i} 
                                    selected={ selectedProposal === i} 
                                    onChange={ this.onSelectedProposal }
                                    name="proposal" />;
                            return (<div key={i}>
                                <span><label>{ caver.utils.hexToUtf8(pr.name) }: </label></span>
                                <span>
                                    {voted ? pr.voteCount : sel}
                                </span>
                            </div>);
                        })}
                        {voted ? <input type="submit" value="Vote" disabled /> : <input type="submit" value="Vote" /> }
                    </form>
                </div>
            </div>
        )
    }
}

export default Voting;