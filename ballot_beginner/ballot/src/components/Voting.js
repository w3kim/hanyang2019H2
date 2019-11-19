import React from 'react';
import caver from '../klaytn/caver'

class Voting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proposals: [],
            selectedProposal: -1,
            voted: false,
            isVoter: false
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
            voted: v.voted,
            isVoter: v.weight > 0 || v.voted
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
        const { proposals, selectedProposal, voted, isVoter } = this.state;
        if (!isVoter) {
            return (<div>Voter only</div>);
        }
        return (
            <div class="container">
                <hr />
                <div>
                    <h2 class="subtitle">Proposals</h2>
                    <table class="table is-hoverable">
                        <thead>
                            <tr>
                                <td>Pos</td>
                                <td>Item</td>
                                {voted && <td>Votes</td>}                                
                            </tr>
                        </thead>
                        <tbody>
                            { proposals.map((pr, i) => {
                                // TODO wire onChange event for each table row
                                let sel = <input type="radio" value={i} 
                                        selected={ selectedProposal === i} 
                                        onChange={ this.onSelectedProposal }
                                        name="proposal" />;
                                return (<tr key={i}>
                                    <td>{i}</td>
                                    <td>{ caver.utils.hexToUtf8(pr.name) }</td>
                                    {voted && <td>{pr.voteCount}</td>}                                    
                                </tr>);
                            })}
                        </tbody>
                    </table>
                    {!voted && <button class="button is-info" value="Vote" />}
                    {/* <div>
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
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Voting;