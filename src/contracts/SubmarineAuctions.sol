pragma solidity ^0.5.16;

contract SubmarineAuctions {
    address public owner;
    string  public name = 'submarine_auctions';
    uint    public lastId = 1;
    mapping(uint => Auction) public auctions;


    struct Auction {
        uint id;
        address payable seller;
        uint minBid;
        address payable [] bidders;
        mapping(address => uint) bids;
    }

    constructor() public {
        owner = msg.sender;
    }

    function getBidder(uint _auctionID, uint _index) public returns (address){
        Auction storage a = auctions[_auctionID];
        return (a.bidders[_index]);
    }

    function getBid(uint _auctionID, uint _index) public returns (uint){
        Auction storage a = auctions[_auctionID];
        return (a.bids[a.bidders[_index]]);
    }

    function createAuction(uint _minBid) public payable {

        require(_minBid > 0);

        lastId ++;

        Auction storage a = auctions[lastId];
        a.id = lastId;
        a.seller = msg.sender;
        a.minBid = _minBid;
    }

    function submitBid(uint _auctionID) public payable {

        Auction storage a = auctions[_auctionID];

        require(msg.value >= a.minBid);

        a.bidders.push(msg.sender);
        a.bids[msg.sender] = msg.value;

    }

    function resolveAuction(uint _auctionID) public {

        Auction storage a = auctions[_auctionID];

        uint _maxBid = 0;
        uint _winnerIndex;

        //Determine winner
        for(uint i=0; i < a.bidders.length; i++){
            if(a.bids[a.bidders[i]] > _maxBid){
                _maxBid = a.bids[a.bidders[i]];
                _winnerIndex = i;
            }
        }

        //Pay seller
        a.seller.transfer(_maxBid);

        //Refund losing bidders
        a.bids[a.bidders[_winnerIndex]] = 0;
        for(uint i=0; i < a.bidders.length; i++){
            a.bidders[i].transfer(a.bids[a.bidders[i]]);
        }
        
        //Send winning bidder the NFT
    }

}