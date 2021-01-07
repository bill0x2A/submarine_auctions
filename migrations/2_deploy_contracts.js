const SubmarineAuctions = artifacts.require("SubmarineAuctions");

module.exports = function(deployer) {
  deployer.deploy(SubmarineAuctions);
};
