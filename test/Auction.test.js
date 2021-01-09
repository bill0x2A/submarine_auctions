const SubmarineAuctions = artifacts.require('SubmarineAuctions');

var BN = require('bn.js');
var bnChai = require('bn-chai');
const { assert } = require('chai');

require('chai')
            .use(require('chai-as-promised'))
            .use(bnChai(BN))
            .should();

const oneEth = web3.utils.toWei('1', 'ether');
const twoEth = web3.utils.toWei('2', 'ether');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

            await auction.createAuction(oneEth, 0, 0, 0, 10, { from : seller });
            auctionID  = await auction.lastId();

            result = await auction.auctions(auctionID);
            
            assert.equal(result.seller.toString(), seller.toString(), 'Seller is not listed as seller');
            assert.equal(result.id.toNumber(), auctionID, 'ID mismatch (Somehow???)');
            assert.equal(result.minBid.toString(), oneEth.toString());
        })

        it('accepts bids on auctions', async () => {

            await auction.submitBid(auctionID, { from : bidder1, value: oneEth });

            result = await auction.auctions(auctionID);
            const maxBid1 = result.maxBid.toString();
            const winner1 = result.winner;

            await auction.submitBid(auctionID, { from : bidder2, value: twoEth});

            result = await auction.auctions(auctionID);
            const maxBid2 = result.maxBid.toString();
            const winner2 = result.winner;

            assert.notEqual(maxBid1, maxBid2, 'Maxbid not updated');
            assert.notEqual(winner1, winner2, 'Winner address not updated');

        })

        it('does not let users withdraw funds early', async () => {
            await auction.bidderWithdraw(auctionID, { from : bidder1 }).should.be.rejected;
            await auction.sellerWithdraw(auctionID, { from : seller }).should.be.rejected;
        })

        it('allows seller to withdraw', async () => {
            await timeout(10000);
            const sellerBalanceBefore = await web3.eth.getBalance(seller);
            await auction.sellerWithdraw(auctionID, { from : seller });
            const sellerBalanceAfter = await web3.eth.getBalance(seller);
            assert.isAbove(parseInt(sellerBalanceAfter), parseInt(sellerBalanceBefore));
        })

        it('allows losing bidder to withdraw their bid', async () => {
            const bidder1BalanceBefore = await web3.eth.getBalance(bidder1);
            await auction.bidderWithdraw(auctionID, { from : bidder1 });
            const bidder1BalanceAfter = await web3.eth.getBalance(bidder1);
            assert.notEqual(bidder1BalanceBefore, bidder1BalanceAfter, 'bidder1 didnt get his cash back!'); // Invalid test due to gas costs, fix
        })

        it('does not allow winner to withdraw their bid', async () => {
            await auction.bidderWithdraw(auctionID, { from : bidder2 }).should.be.rejected;
        })

    })
})