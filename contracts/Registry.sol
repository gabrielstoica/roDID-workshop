// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./interfaces/IRegistry.sol";

contract Registry is IRegistry {
  /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
  //////////////////////////////////////////////////////////////////////////*/

  address owner;
  address public resolver;

  mapping(address => Identity) public identity;

  struct Identity {
    bool status;
    address controller;
    string did;
    string[] documents;
  }

  /*//////////////////////////////////////////////////////////////////////////
                                ERRORS
  //////////////////////////////////////////////////////////////////////////*/

  error Unauthorized();
  error InvalidOwnerAddress();

  /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
  //////////////////////////////////////////////////////////////////////////*/

  constructor(address initialOwner) {
    owner = initialOwner;
    resolver = msg.sender;
    emit TransferOwnership({ oldOwner: address(0), newOwner: initialOwner });
  }

  /*//////////////////////////////////////////////////////////////////////////
                                MODIFIERS
  //////////////////////////////////////////////////////////////////////////*/

  modifier onlyOwner() {
    if (msg.sender != owner) revert Unauthorized();
    _;
  }

  modifier onlyController(address publicKey) {
    if (msg.sender != identity[publicKey].controller) revert Unauthorized();
    _;
  }

  modifier onlyResolver() {
    if (msg.sender != resolver) revert Unauthorized();
    _;
  }

  /*//////////////////////////////////////////////////////////////////////////
                                MANAGEMENT METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function addIdentity(address attendee, string memory did, string[] memory documents) external onlyOwner {
    Identity memory newIdentity = Identity(true, owner, did, documents);
    identity[attendee] = newIdentity;

    emit AddIdentity(attendee, owner, did, documents);
  }

  function updateIdentityStatus(address attendee, bool newStatus) external onlyController(attendee) {
    identity[attendee].status = newStatus;

    emit UpdateIdentityStatus(attendee, newStatus);
  }

  function addIdentityDocument(address publicKey, string memory document) external onlyController(publicKey) {
    identity[publicKey].documents.push(document);

    emit AddIdentityDocument(publicKey, document);
  }

  /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC FACING METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function getOwner() external view returns (address) {
    return owner;
  }

  /*//////////////////////////////////////////////////////////////////////////
                                ADMIN METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function transferOwnership(address newOwner) external onlyResolver {
    if (newOwner == address(0)) revert InvalidOwnerAddress();
    _transferOwnership(newOwner);
  }

  function _transferOwnership(address newOwner) internal {
    address oldOwner = owner;
    owner = newOwner;
    emit TransferOwnership(oldOwner, newOwner);
  }
}
