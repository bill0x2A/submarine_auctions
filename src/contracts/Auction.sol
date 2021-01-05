pragma solidity ^0.5.16;

contract Auction {
    address public owner;
    string public name;
    uint256 public lastId = 1;
    mapping(uint => Auction) public activeAuctions;

    struct Bid {
        address bidder,
        uint256 bidAmount
    }

    struct Auction {
        uint256 id,
        address payable seller,
        Bid[] bids
    }


    constructor() public {
        owner = msg.sender;
    }


    function createAuction(address _seller, uint265 _auctionLength, uint265) public payable {
        // Require NFT in transaction 
        // Other basic requires

        // Create id for auction and add it to a list of active auctions

    }

    function submitBid(uint256 _auctionID) public payable {
        require(msg.value > 0);
        activeAuctions[_auctionID].bids.push(new Bid(msg.sender, msg.value));
        
    }

}