const Store = artifacts.require('Store');
const StoreToken = artifacts.require('StoreToken');

contract('ExampleStore', accounts => {
  const [admin, buyer1, buyer2, seller1, seller2, ...rest] = accounts;
  const DECIMAL = 10**6; //Note: actual value 10**18 triggers bug, see https://github.com/ethereum/web3.js/issues/2077
  let erc20;
  let myStore;

  beforeEach(async () => {
    erc20 = await StoreToken.deployed();
    myStore = await Store.new(
      erc20.address,
    );
  });

  it('should complete the store transactions', async () => {
    await erc20.mint(99999*DECIMAL);
    await erc20.transfer(buyer1, 20*DECIMAL);
    await erc20.approve(myStore.address, 20*DECIMAL, { from:buyer1 });
    await erc20.transfer(buyer2, 40*DECIMAL);
    await erc20.approve(myStore.address, 40*DECIMAL, { from:buyer2 });

    const buyer1Balance = await erc20.balanceOf(buyer1);
    const buyer2Balance = await erc20.balanceOf(buyer2);
    assert.equal(buyer1Balance.toNumber(), 20*DECIMAL, "Buyer One's balance should be exactly 20");
    assert.equal(buyer2Balance.toNumber(), 40*DECIMAL, "Buyer Two's balance should be exactly 40");

    await myStore.offer(web3.utils.asciiToHex("Coffee"), 3*DECIMAL, {from: seller1});
    await myStore.offer(web3.utils.asciiToHex("T-shirt"), 5*DECIMAL, {from: seller2});
    await myStore.offer(web3.utils.asciiToHex("Tea"), 2.5*DECIMAL, {from: seller1});
    await myStore.offer(web3.utils.asciiToHex("Cake"), 3.5*DECIMAL, {from: seller1});
    await myStore.offer(web3.utils.asciiToHex("Shorts"), 8*DECIMAL, {from: seller2});
    await myStore.offer(web3.utils.asciiToHex("Hoody"), 12*DECIMAL, {from: seller2});
  
    const priceOfCoffee = await myStore.priceOf(web3.utils.asciiToHex("Coffee"));
    const sellerOfCoffee = await myStore.sellerOf(web3.utils.asciiToHex("Coffee"));
    assert.equal(priceOfCoffee, 3*DECIMAL, "wrong price of coffee");
    assert.equal(sellerOfCoffee, seller1, "wrong seller of coffee");

    const priceOfTshirt = await myStore.priceOf(web3.utils.asciiToHex("T-shirt"));
    const sellerOfTshirt = await myStore.sellerOf(web3.utils.asciiToHex("T-shirt"));
    assert.equal(priceOfTshirt, 5*DECIMAL, "wrong price of T-shirt");
    assert.equal(sellerOfTshirt, seller2, "wrong seller of T-shirt");

    await myStore.order(web3.utils.asciiToHex("T-shirt"), {from: buyer1});
    await erc20.transfer(buyer1, 10*DECIMAL);
    await erc20.approve(myStore.address, 10*DECIMAL, { from:buyer1 });
    await myStore.order(web3.utils.asciiToHex("Hoody"), {from: buyer2});
    await myStore.complete(web3.utils.asciiToHex("T-shirt"), {from: buyer1});
    await myStore.order(web3.utils.asciiToHex("Coffee"), {from: buyer1});
    await myStore.order(web3.utils.asciiToHex("Cake"), {from: buyer1});
    await myStore.complain(web3.utils.asciiToHex("Hoody"), {from: buyer2});
    await myStore.order(web3.utils.asciiToHex("Tea"), {from: buyer2});
    await myStore.complete(web3.utils.asciiToHex("Coffee"), {from: buyer1});

    const buyer1BalanceFinal = await erc20.balanceOf(buyer1);
    assert.equal(buyer1BalanceFinal.toNumber(), 18.5*DECIMAL, "Buyer One's balance should be exactly 18.5");
    const seller2BalanceFinal = await erc20.balanceOf(seller2);
    assert.equal(seller2BalanceFinal.toNumber(), 5*DECIMAL, "Seller Two's balance should be exactly 5");
    const escrowBalanceFinal = await erc20.balanceOf(myStore.address);
    assert.equal(escrowBalanceFinal.toNumber(), 6*DECIMAL, "escrow's balance should be exactly 6");
  });

});
