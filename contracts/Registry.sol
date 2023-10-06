// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./interfaces/IRegistry.sol";

contract Registry is IRegistry {
  /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC STORAGE
  //////////////////////////////////////////////////////////////////////////*/

  address public owner;
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

  function addIdentity(address publicKey, string memory did, string[] memory documents) public onlyOwner {
    Identity memory newIdentity = Identity(true, owner, did, documents);
    identity[publicKey] = newIdentity;

    emit AddIdentity(publicKey, owner, did, documents);
  }

  function updateIdentityStatus(address publicKey, bool newStatus) public onlyController(publicKey) {
    identity[publicKey].status = newStatus;

    emit UpdateIdentityStatus(publicKey, newStatus);
  }

  function addIdentityDocument(address publicKey, string memory document) public onlyController(publicKey) {
    identity[publicKey].documents.push(document);

    emit AddIdentityDocument(publicKey, document);
  }

  /*//////////////////////////////////////////////////////////////////////////
                                ADMIN METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function transferOwnership(address newOwner) public onlyResolver {
    if (newOwner == address(0)) revert InvalidOwnerAddress();
    _transferOwnership(newOwner);
  }

  function _transferOwnership(address newOwner) internal {
    address oldOwner = owner;
    owner = newOwner;
    emit TransferOwnership(oldOwner, newOwner);
  }
}
