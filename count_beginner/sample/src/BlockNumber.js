
import React from 'react'
import Caver from 'caver-js'

const BAOBAB_TESTNET_RPC_URL = 'https://api.baobab.klaytn.net:8651/'

const caver = new Caver(BAOBAB_TESTNET_RPC_URL)

class BlockNumber extends React.Component {
  state = {
    currentBlockNumber: '...loading',
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
    const { currentBlockNumber } = this.state
    return (
      <div>Block No. {currentBlockNumber}</div>
    )
  }
}

export default BlockNumber