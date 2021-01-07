const { assert } = require('chai');

const SubmarineAuctions = artifacts.require('SubmarineAuctions');

require('chai')
    .use(require('chai-as-promised'))
    .should();

const oneEth = web3.utils.toWei('1', 'ether');

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

            result = await auction.activeAuctions(auctionID);
            
            assert.equal(result.seller.toString(), seller.toString(), 'Seller is not listed as seller');
            assert.equal(result.id.toNumber(), auctionID, 'ID mismatch (Somehow???)');
            assert.equal(result.bidSize.toNumber(), '0');
        })

        it('accepts bids on auctions', async () => {

            let bidderBalance = await web3.eth.getBalance(bidder1);
            let contractBalance;

            await auction.submitBid(auctionID, { from : bidder1, value: oneEth });

            result = await auction.activeAuctions(auctionID);
            assert.equal(result.bidSize.toNumber(), 1, 'bidSize not incremented');
            

            await auction.submitBid(auctionID, { from : bidder2, value: oneEth });
            result = await auction.activeAuctions(auctionID);
            contractBalance = await web3.eth.getBalance(auction.address);

            assert.equal(result.bidSize.toNumber(), 2, 'bidSize not incremented');
            assert.equal(contractBalance, web3.utils.toWei('2', 'ether'), 'Contract balance incorrect');
        })

        it('resolves auctions', async () => {

        })
    })
})