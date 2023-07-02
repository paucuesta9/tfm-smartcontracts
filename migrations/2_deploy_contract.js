const Token = artifacts.require('Token.sol');
const BridgeEth = artifacts.require('BridgeEth.sol');
const BridgePol = artifacts.require('BridgePol.sol');

module.exports = async function (deployer, network, addresses) {
  console.log('Deploying contracts to network ' + network);
  if (network === 'sepolia') {
    await deployer.deploy(Token, 'Ethereum TFM Token', 'ETFM');
    const tokenEth = await Token.deployed();
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if (network === 'mumbai') {
    await deployer.deploy(Token, 'Matic TFM Token', 'MTFM');
    const tokenMat = await Token.deployed();
    await deployer.deploy(BridgePol, tokenMat.address);
    const bridgePol = await BridgePol.deployed();
    await tokenMat.updateAdmin(bridgePol.address);
  }
};