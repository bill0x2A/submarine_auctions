pragma solidity ^0.5.16;

contract SubmarineAuctions {
    address public owner;
    string  public name = 'submarine_auctions';
    uint    public lastId = 1;
    mapping(uint => Auction) public activeAuctions;

    struct Bid {
        address bidder;
        uint    amount;
    }

    struct Auction {
        uint  id;
        address seller;
        uint minBid;
        uint bidSize;
        mapping(uint => Bid) bids;
    }

    event BidMade (
        uint auctionID,
        address bidder,
        uint bidAmount
    );


    constructor() public {
        owner = msg.sender;
    }

    function createAuction(uint _minBid) public payable {

        require(_minBid > 0);

        lastId ++;

        Auction memory newAuction = Auction({
            id : lastId,
            minBid : _minBid,
            seller : msg.sender,
            bidSize : 0 
        });

        activeAuctions[lastId] = newAuction;
    }

    function submitBid(uint _auctionID) public payable {

        require(msg.value > 0);

        Bid memory bid = Bid({
            bidder : msg.sender,
            amount : msg.value
        });

        activeAuctions[_auctionID].bids[ activeAuctions[_auctionID].bidSize ] = bid;
        activeAuctions[_auctionID].bidSize ++;

        emit BidMade(_auctionID, msg.sender, msg.value);
    }

    function resolveAuction(uint _auctionID) public {
        // for(uint i=0;i<)

        // Transfer NFT to bidder

        // Transfer highest bid to owner

        // Remove auction from active auctions array

        // Pay back everyone else - How to do this without awful gas fees?? lol
    }

}