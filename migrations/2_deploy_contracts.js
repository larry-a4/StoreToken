const StoreToken = artifacts.require('StoreToken');
const Store = artifacts.require('Store');

module.exports = function(deployer, network, accounts) {
  const deployFee = () => deployer.deploy(Fee, StoreToken.address);
  // Deploy an example tournament with:
  const deployExampleStore = () =>
    deployer.deploy(
      Store,
      StoreToken.address
    );

  deployer
    .deploy(StoreToken)
    .then(deployExampleStore);

  // Mint the balance
};
