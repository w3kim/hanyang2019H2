// This example is directly taken from https://solidity.readthedocs.io/en/v0.5.12/solidity-by-example.html#voting
// Some modifications are made to help readers understand this contract.
pragma solidity ^0.5.6;
contract Ballot {
    // ==========
    // TODO explain `struct` with an example or two
    // ==========
    // This declares a new complex type which will be used for variables later.
    // It represents a single voter.
    struct Voter {
        uint weight; // weight indicates voting power that this voter has
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    // ==========
    // TODO explain `bytes32` vs. `string`
    // ==========
    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    // This should be the creator of this contract
    address public chairperson;

    // ==========
    // TODO recap `mapping`
    // ==========
    // This declares a state variable that stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    // Idea 1: Close Ballot when the chairperson says so.
    // This indicates the current status of this Ballot.
    Status public status;

    // ==========
    // TODO recap `constructor`.
    // TODO explain reference types with modifiers: `memory`, `storage`, and `calldata`.
    // ==========
    /// Create a new ballot to choose one of `proposalNames`.
    // Create a new ballot to choose one of `proposalNames`.
    // e.g., a ballot with proposal names ["test1", "test2", "test3", "test4"] is equal to the following:
    // ["0x7465737431000000000000000000000000000000000000000000000000000000", "0x7465737432000000000000000000000000000000000000000000000000000000", "0x7465737433000000000000000000000000000000000000000000000000000000","0x7465737434000000000000000000000000000000000000000000000000000000" ]
    constructor(bytes32[] memory proposalNames) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }

        // Idea 1: Close Ballot when the chairperson says so.
        status = Status.Open;
    }

    function getNumProposals() public view returns (uint) {
        return proposals.length;
    }

    // ==========
    // TODO explain `require(predicate, message)` with an example or two.
    // ==========
    // Give `voter` the right to vote on this ballot.
    // May only be called by `chairperson`.
    function giveRightToVote(address voter) public {
        // If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // This used to consume all gas in old EVM versions, but
        // not anymore.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        
        // ==========
        // Idea 1: require(status == Status.Open, "The ballot is closed");
        // ==========

        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(
            voters[voter].weight == 0,
            "The voter must not be registered"
        );
        voters[voter].weight = 1;
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) public {
        // ==========
        // Idea 1: require(status == Status.Open, "The ballot is closed");
        // ==========

        // assigns reference
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "Self-delegation is disallowed.");

        // Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        address to_ = to;
        while (voters[to_].delegate != address(0)) {
            to_ = voters[to_].delegate;

            // We found a loop in the delegation, not allowed.
            require(to_ != msg.sender, "Found loop in delegation.");
        }

        // Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        sender.voted = true;
        sender.delegate = to_;
        Voter storage delegate_ = voters[to_];
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal) public {
        // ==========
        // Idea 1: require(status == Status.Open, "The ballot is closed");
        // ==========

        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }

    // Idea 1: Close Ballot when the chairperson says so
    enum Status { Open, Closed }
    function closeBallot() public {
        require(msg.sender == chairperson, "Only the chairperson can close the ballot");
        status = Status.Closed;
    }

    // Idea 2: Bulk Registration
    // Give voters in `voterList` the right to vote on this ballot.
    // May only be called by `chairperson`.
    // e.g.,
    // ["0x5e47b195eeb11d72f5e1d27aebb6d341f1a9bedb", "0xd0ea3e0eabaea095ea3ba231c043dbf8c0feb40a", "0x34ca11930cd5e0971d8bb9860d9b977d3bb9187b"]
    function giveRightToVoteToAll(address[] memory voterList) public {
        // ==========
        // Idea 1: require(!isClosed, "The ballot is closed");
        // ==========

        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );

        for (uint v = 0; v < voterList.length; v++) {
            address voter = voterList[v];
            if (!voters[voter].voted && voters[voter].weight == 0) {
                voters[voter].weight = 1;
            }
        }
    }
}