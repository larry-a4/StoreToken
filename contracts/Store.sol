pragma solidity >=0.5.8 < 0.6.0;

import "./StoreToken.sol";

contract Store {
    ERC20 public tokenContract;

    mapping(bytes32 => uint) public priceOf;
    mapping(bytes32 => address) public sellerOf;
    mapping(address => mapping(bytes32 => uint)) quantityOrdered;

    event LogOffer(bytes32 item, uint price);
    event LogOrder(bytes32 item);

    constructor(
        address tokenContractAddress
    ) public {
        tokenContract = ERC20(tokenContractAddress);
    }

    function offer(bytes32 item, uint price) public {
        require(price > 0, "price must be positive");
        require(priceOf[item] <= 0, "item already exist");
        
        priceOf[item] += price;
        sellerOf[item] = msg.sender;
        
        emit LogOffer(item, price);
    }
    
    function order(bytes32 item) public {
        require(priceOf[item] > 0, "item does not exist");
        
        tokenContract.transferFrom(msg.sender, address(this), priceOf[item]);
        quantityOrdered[msg.sender][item] += 1;
        
        emit LogOrder(item);
    }

    function complain(bytes32 item) public {
        require(priceOf[item] > 0, "item does not exist");
        require(quantityOrdered[msg.sender][item] > 0, "you did not order this item");

        tokenContract.transferFrom(address(this), msg.sender, priceOf[item]);
        quantityOrdered[msg.sender][item] -= 1;
    }

    function complete(bytes32 item) public {
        require(priceOf[item] > 0, "item does not exist");
        require(quantityOrdered[msg.sender][item] > 0, "you did not order this item");

        tokenContract.transferFrom(address(this), sellerOf[item], priceOf[item]);
        quantityOrdered[msg.sender][item] -= 1;
    }
}