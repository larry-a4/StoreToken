# store-contract-mvp

A basic implementation of the buyer and seller contracts

# Assumption and Design

The seller can post any item for sale, as long as the item name is unique.

Anyone can then query an item by its name, and get its price and seller.

The buyer can order any item by its name, if they have enough balance in their account. Note: the buyer can order multiple instances of the same item.

You need `npm` to use the development environment.

## Setup

Make sure to have `ganache-cli` and `truffle` installed via npm.

```bash
$ npm i -g ganache-cli truffle@5.0.35
```

To compile, run:

```bash
$ truffle compile
```

To test, run:

```bash
# Might want to do this from a different shell
$ ganache-cli
$ truffle test
```

## Usage

Development:

```
$ truffle develop
```

Call `migrate` inside the console to run the example deployment.

Compilation:

```
$ truffle compile
```

Look inside the `build/` folder for the contract's ABI and bytecode.
