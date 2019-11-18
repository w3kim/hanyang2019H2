/**
 * Klaytn provides Javascript SDK `caver-js` which helps developers communicate
 * with the Klaytn blockchain network. By specifying an URL when creating a Caver
 * instance, you can connect to your chosen Klaytn end-point node.
 * 
 * For testing/developing purpose, we use 'https://api.baobab.klaytn.net:8651',
 * the URL pointing to the public end-point available for Baobab testnet.
 */
import Caver from 'caver-js'

const BAOBAB_TESTNET_RPC_URL = 'https://api.baobab.klaytn.net:8651/'

const caver = new Caver(BAOBAB_TESTNET_RPC_URL)

export default caver