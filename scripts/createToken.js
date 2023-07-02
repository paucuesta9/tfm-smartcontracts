const BridgeEth = artifacts.require('BridgeEth.sol');


module.exports = async done => {
  const nonce = 7; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  const amount = web3.utils.toWei('5000');
  const message = web3.utils.soliditySha3(
    { t: 'address', v: '0xC117aDa59a2244594B967eFB9eD43663BB3c7F6D' },
    { t: 'address', v: '0xC117aDa59a2244594B967eFB9eD43663BB3c7F6D' },
    { t: 'uint256', v: amount },
    { t: 'uint256', v: nonce },
  ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
    message,
    PRIVATE_KEY
  );
  const result = await bridgeEth.mint('0xC117aDa59a2244594B967eFB9eD43663BB3c7F6D', '0xC117aDa59a2244594B967eFB9eD43663BB3c7F6D', amount, amount, nonce, signature);
  console.log(result);
  done();
}