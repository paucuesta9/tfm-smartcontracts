// require('dotenv').config();

const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgePol = require('../build/contracts/BridgePol.json');

// const PRIVATE_KEY = process.env["PRIVATE_KEY"];

console.log('Ethereum WebSocket: connecting...');

const ethereumWebSocket = new Web3(new Web3.providers.WebsocketProvider('wss://sepolia.infura.io/ws/v3/INFURA_API_KEY'));
const polygonWebSocket = new Web3(new Web3.providers.WebsocketProvider('wss://polygon-mumbai.infura.io/ws/v3/INFURA_API_KEY'));

console.log('Ethereum WebSocket: connected');


const { address: adminEthereum } = ethereumWebSocket.eth.accounts.wallet.add(PRIVATE_KEY);
const { address: adminPolygon } = polygonWebSocket.eth.accounts.wallet.add(PRIVATE_KEY);

console.log(`Admin Ethereum address: ${adminEthereum}`);

const bridgeEth = new ethereumWebSocket.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['11155111'].address
);

const bridgePol = new polygonWebSocket.eth.Contract(
  BridgePol.abi,
  BridgePol.networks['80001'].address
);

console.log(`Bridge Ethereum address: ${bridgeEth.options.address}`);

bridgeEth.events.Transfer(
  { fromBlock: 0, step: 0 }
)
  .on('data', async event => {
    try {
      const { userAddress, amount, date, nonce, signature } = event.returnValues;
      const newAmount = BigInt(amount) * 50n;

      const tx = bridgePol.methods.mint(adminPolygon, userAddress, amount, newAmount, nonce, signature);
      const [gasPrice, gasCost] = await Promise.all([
        polygonWebSocket.eth.getGasPrice(),
        tx.estimateGas({ from: adminPolygon }),
      ]);
      const data = tx.encodeABI();
      const txData = {
        from: adminPolygon,
        to: bridgePol.options.address,
        data,
        gas: gasCost,
        gasPrice
      };
      const receipt = await polygonWebSocket.eth.sendTransaction(txData);
      console.log(`Transaction hash: ${receipt.transactionHash}`);
      console.log(`Processed transfer: - address ${userAddress} - amount ${newAmount} tokens - date ${date} - nonce ${nonce}`);
    } catch (e) {
      console.log(e);
    }
  });