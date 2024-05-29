// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./IERC6672.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "stl-contracts/tokens/ERC721OptimizedEnumerable.sol";
import "stl-contracts/ERC/ERC5169.sol";

contract ERC6672 is Ownable, ERC5169, ERC721OptimizedEnumerable, AccessControlEnumerable, IERC6672 {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    mapping(address => bool) private operatorsMap;
    mapping(address => bytes32[]) private operatorsRedememptionIds;

    struct RedeemData {
        bytes32 id;
        string memo;
        bool canceled;
    }
    
    mapping(bytes32 => RedeemData[]) public operatorAndTokenToRedeemData;

    event AddedOperator(address indexed _operator);
    event RemovedOperator(address indexed _operator);

    // error AlreadyRedeemed();
    // error NotRedeemed();
    error NotAnOperator();

    constructor() ERC721OptimizedEnumerable("ERC6672_DEMO", "ERC6672") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function _authorizeSetScripts(string[] memory newScriptURI) internal virtual override onlyOwner {}

    function addOperator(address _operator) public onlyOwner {
        _grantRole(OPERATOR_ROLE, _operator);
        emit AddedOperator(_operator);
        console.logBytes32(OPERATOR_ROLE);
    }

    function removeOperator(address _operator) public onlyOwner {
        // TODO replace to custom error to save gas
        if (!_revokeRole(OPERATOR_ROLE, _operator)){
            revert NotAnOperator();
        }
        emit RemovedOperator(_operator);
    }

    function getOperators() public view returns (address[] memory ){
        uint count = getRoleMemberCount(OPERATOR_ROLE);
        address[] memory addresses = new address[](count);
        for (uint i = 0; i < count; i++){
            addresses[i] = getRoleMember(OPERATOR_ROLE, i);
        }
        return addresses;
    }

    /** 
     * !!! Just for demo, we dont validate if operator redeem only allowed redemptions  
     */
    function setAllowedRedempltionIds(bytes32[] calldata ids) public {
        if (!hasRole(OPERATOR_ROLE, _msgSender())){
            revert NotAnOperator();
        }
        operatorsRedememptionIds[_msgSender()] = ids;
    }

    function getAllowedRedempltionIds(address operator) external view returns (bytes32[] memory){
        if (!hasRole(OPERATOR_ROLE, operator)){
            revert NotAnOperator();
        }
        return operatorsRedememptionIds[operator];
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721OptimizedEnumerable, ERC5169)
        returns (bool)
    {
        return
            AccessControlEnumerable.supportsInterface(interfaceId) ||
            ERC721OptimizedEnumerable.supportsInterface(interfaceId) ||
            ERC5169.supportsInterface(interfaceId) ||
            interfaceId == type(IERC6672).interfaceId;
    }

    function hashAddressAndUint(address _address, uint _uint) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address, _uint));
    }

    function isRedeemed(
        address _operator,
        bytes32 _redemptionId,
        uint256 _tokenId
    ) external view override returns (bool) {
        _requireOwned(_tokenId);
        uint count = operatorAndTokenToRedeemData[hashAddressAndUint(_operator, _tokenId)].length;
        for (uint i = 0; i < count; i++) {
            RedeemData memory current = operatorAndTokenToRedeemData[hashAddressAndUint(_operator, _tokenId)][i];
            if (current.id == _redemptionId && current.canceled){
                return true;
            }
        }
        return false;
    }

    // keep in mind that IDs can be non-unique
    function getRedemptionIds(
        address _operator,
        uint256 _tokenId
    ) external view override returns (bytes32[] memory) {
        if (!hasRole(OPERATOR_ROLE, _operator)){
            revert NotAnOperator();
        }
        uint count = operatorAndTokenToRedeemData[hashAddressAndUint(_operator, _tokenId)].length;
        require(_ownerOf(_tokenId) != address(0), "Token doesnt exist");
        bytes32[] memory ids = new bytes32[](count);
        uint counter = 0; 
        for (uint i = 0; i < count; i++) {
            RedeemData memory current = operatorAndTokenToRedeemData[hashAddressAndUint(_operator, _tokenId)][i];
            if (!current.canceled){
                ids[counter++] = current.id;
                // ids.push(current.id);
            }
        }
        if (counter == count){
            return ids;
        }
        bytes32[] memory smallerIds = new bytes32[](counter);
        for (uint i = 0; i < counter; i++) {
            smallerIds[i] = ids[i];
        }
        return smallerIds;
    }

    // TODO decide how to handle redeption of _redemptionId, which redeemed and then canceled
    function redeem(
        bytes32 _redemptionId,
        uint256 _tokenId,
        string calldata _memo
    ) external override onlyRole(OPERATOR_ROLE) {
        address nftOwner = _requireOwned(_tokenId);
        // gas-expensive operation
        // if (isRedeemed(msg.sender, _redemptionId, _tokenId)){
        //     revert AlreadyRedeemed();
        // }
        updateRedeem(_redemptionId, _tokenId, _memo, true);
    }

    function cancel(
        bytes32 _redemptionId,
        uint256 _tokenId,
        string calldata _memo
    ) external override onlyRole(OPERATOR_ROLE){
        _requireOwned(_tokenId);
        // gas-expensive check, developer has to check it in view TX
        // if (!isRedeemed(msg.sender, _redemptionId, _tokenId)){
        //     revert NotRedeemed();
        // }
        updateRedeem(_redemptionId, _tokenId, _memo, false);
    }

    function updateRedeem(
        bytes32 _redemptionId,
        uint256 _tokenId,
        string calldata _memo,
        bool _redeem
    ) internal {
        uint count = operatorAndTokenToRedeemData[hashAddressAndUint(msg.sender, _tokenId)].length;
        for (uint i = 0; i < count; i++) {
            RedeemData memory current = operatorAndTokenToRedeemData[hashAddressAndUint(msg.sender, _tokenId)][i];
            if (current.id == _redemptionId){
                operatorAndTokenToRedeemData[hashAddressAndUint(msg.sender, _tokenId)][i].memo = _memo;
                operatorAndTokenToRedeemData[hashAddressAndUint(msg.sender, _tokenId)][i].canceled = !_redeem;
                if (_redeem){
                    emit Redeem(msg.sender, _tokenId, msg.sender, _redemptionId, _memo);
                } else {
                    emit Cancel(msg.sender, _tokenId, _redemptionId, _memo);
                }
                return;
            }
        }
        if (_redeem){
            operatorAndTokenToRedeemData[hashAddressAndUint(msg.sender, _tokenId)].push(RedeemData(_redemptionId, _memo, false));
            emit Redeem(msg.sender, _tokenId, msg.sender, _redemptionId, _memo);
        } else {
            revert("RedemptionID not found");
        }
    }

    // function isOwnerAddress(address addr) external view returns (bool){
    //     return addr == owner();
    // }

    function mint(address to) external onlyOwner(){
        _mint(to);
    }
    function burn(uint tokenId) external {
        _burn(tokenId);
    }
}
