# store-contract-mvp

A basic implementation of the buyer and seller contracts

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
