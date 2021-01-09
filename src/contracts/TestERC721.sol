pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestERC721 is ERC721{

    constructor() ERC721("Test", "TEST") public {}

    string[] public tokens;
    mapping(string => bool) tokenExists;
    
    function mint(string memory _tokenName) public {

        require(!tokenExists[_tokenName]);

        tokens.push(_tokenName);
        uint _id = tokens.length;
        tokenExists[_tokenName] = true;
        _mint(msg.sender, _id);

    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }

}
