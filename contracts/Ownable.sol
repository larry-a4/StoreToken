pragma solidity >= 0.4.25 < 0.6.0;

contract Ownable {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "must be the owner of this contract");
        _;
    }
}
