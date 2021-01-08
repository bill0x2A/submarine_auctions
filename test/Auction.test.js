const { assert } = require('chai');

const SubmarineAuctions = artifacts.require('SubmarineAuctions');

require('chai')
    .use(require('chai-as-promised'))
    .should();

const oneEth = web3.utils.toWei('1', 'ether');
const twoEth = web3.utils.toWei('2', 'ether');

contract('SubmarineAuctions', ([owner, seller, bidder1, bidder2]) => {
    let auction, result, auctionID;

    before(async () => {
        // Load contact instances
        auction = await SubmarineAuctions.deployed();
    })

    describe('Auction house', async () => {

        it('deploys correctly', async () => {
            result = await auction.name();
            assert.equal(result, 'submarine_auctions');
        })

        it('creates new auctions', async () => {

            await auction.createAuction(oneEth, { from : seller });
            auctionID  = await auction.lastId();

            result = await auction.auctions(auctionID);
            
            assert.equal(result.seller.toString(), seller.toString(), 'Seller is not listed as seller');
            assert.equal(result.id.toNumber(), auctionID, 'ID mismatch (Somehow???)');
            assert.equal(result.minBid.toString(), oneEth.toString());
        })

        it('accepts bids on auctions', async () => {

            let bidderBalance = await web3.eth.getBalance(bidder1);
            let contractBalance;

            await auction.submitBid(auctionID, { from : bidder1, value: oneEth });

            const bidder1Address = await auction.getBidder(auctionID, 0);
            const bidder1Amount = await auction.getBid(auctionID, 0);

            assert(bidder1Address, bidder1, 'Bidder1 does not exist, or bid is incorrectly stored');
            assert(bidder1Amount, oneEth, 'Bidder1 does not exist, or bid is incorrectly stored');

            await auction.submitBid(auctionID, { from : bidder2, value: twoEth});
            
            const bidder2Address = await auction.getBidder(auctionID, 1);
            const bidder2Amount = await auction.getBid(auctionID, 1);

            assert(bidder2Address, bidder2, 'Bidder2 does not exist, or bid is incorrectly stored');
            assert(bidder2Amount, twoEth, 'Bidder2 does not exist, or bid is incorrectly stored');
        })

        it('resolves auctions', async () => {


            let sellerBalanceBefore = await web3.eth.getBalance(seller);
            let bidder1BalanceBefore = await web3.eth.getBalance(bidder1);
            let bidder2BalanceBefore = await web3.eth.getBalance(bidder2);

            await auction.resolveAuction(auctionID);

            let sellerBalanceAfter = await web3.eth.getBalance(seller);
            let bidder1BalanceAfter = await web3.eth.getBalance(bidder1);
            let bidder2BalanceAfter = await web3.eth.getBalance(bidder2);

            // Seller recieves their money
            assert.isAbove(sellerBalanceAfter, sellerBalanceBefore, 'Sellers balance did not increase');

            // Winner recieves their NFT

            // Winner does not get any tokens back
            assert.equal(bidder2BalanceBefore, bidder2BalanceAfter, 'Winner balance changed');

            // Losing bidders get their money back
            assert.isAbove(bidder1BalanceAfter, bidder1BalanceBefore, 'Losing bidder was not refunded');

        })
    })
})