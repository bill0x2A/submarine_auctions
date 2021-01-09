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
        uint maxBid;
        uint endTime;
        address winner;
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

    function createAuction(uint _minBid, uint _days,  uint _hours, uint _minutes) public payable {

        require(_minBid > 0);

        lastId ++;

        Auction storage a = auctions[lastId];
        a.id = lastId;
        a.maxBid = 0;
        a.seller = msg.sender;
        a.minBid = _minBid;
        a.endTime = now + ( _days * 1 days) + ( _hours * 1 hours) + ( _minutes * 1 minutes);
    }

    function submitBid(uint _auctionID) public payable {

        Auction storage a = auctions[_auctionID];

        // Only 1 bid per address allowed
        require(msg.value >= a.minBid && a.bids[msg.sender] == 0);

        a.bids[msg.sender] = msg.value;

        if(msg.value > a.maxBid){
            a.maxBid = msg.value;
            a.winner = msg.sender;
        }

    }

    function sellerWidthdraw(uint _auctionID) public {
        Auction storage a = auctions[_auctionID];
        require(now >= a.endTime);
        require(msg.sender == a.seller);

        if(a.maxBid < a.minBid){
            // Transfer NFT back to owner
        } else {
            msg.sender.transfer(a.maxBid);  
        }
        
    }

    function bidderWidthdraw(uint _auctionID) public {
        
        Auction storage a = auctions[_auctionID];
        
        require(now >= a.endTime);

        if(msg.sender == a.winner){

            // Send winner the NFT;

        } else {
            msg.sender.transfer(a.bids[msg.sender]);
        }
    }

}