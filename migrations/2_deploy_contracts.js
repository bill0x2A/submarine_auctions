const SubmarineAuctions = artifacts.require("SubmarineAuctions");
const TestERC721 = artifacts.require("TestERC721");

module.exports = function(deployer) {
  deployer.deploy(SubmarineAuctions);
  deployer.deploy(TestERC721);
};
