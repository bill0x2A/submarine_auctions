const { assert } = require('chai');

const TestERC721 = artifacts.require('TestERC721');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('TestERC721', accounts => {
    let contract
    describe('deployment', async () => {

        before(async () => {
            contract = await TestERC721.deployed();
        })

        it('deploys successfully', async () => {

            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

            const name = await contract.name();
            const symbol = await contract.symbol();

            assert.equal(name, "Test");
            assert.equal(symbol, "TEST");
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            let result = await contract.mint('#34c6eb');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1);
            assert.equal(event.from, 0x0000000000000000000000000000000000000000);
            assert.equal(event.to, accounts[0]);
        })
    })
})