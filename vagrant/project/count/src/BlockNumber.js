import React from 'react';
import Caver from 'caver-js';

const caver = new Caver('https://api.baobab.klaytn.net:8651/')

class BlockNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBlockNumber: 0
        }
    }

    getBlockNumber = async () => {
        const blockNumber = await caver.klay.getBlockNumber()
        this.setState({ currentBlockNumber: blockNumber })
    }

    intervalId = null

    componentDidMount() {
        this.intervalId = setInterval(this.getBlockNumber, 1000)
    }

    componentWillUnmount() {
        if (this.intervalId) clearInterval(this.intervalId)
    }

    render() {
        const {currentBlockNumber } = this.state;
        return <div>
            <span>Block No. {currentBlockNumber}</span>
        </div>;
    }
}

export default BlockNumber;