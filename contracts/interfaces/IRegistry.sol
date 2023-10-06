// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRegistry {
  /*//////////////////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////////////////*/

  event AddIdentity(address indexed publicKey, address owner, string did, string[] documents);
  event AddIdentityDocument(address indexed publicKey, string document);
  event UpdateIdentityStatus(address indexed publicKey, bool newStatus);
  event TransferOwnership(address indexed oldOwner, address indexed newOwner);

  /*//////////////////////////////////////////////////////////////////////////
                                MANAGEMENT METHODS
    //////////////////////////////////////////////////////////////////////////*/

  function addIdentity(address publicKey, string memory did, string[] memory documents) external;

  function updateIdentityStatus(address publicKey, bool newStatus) external;

  function addIdentityDocument(address publicKey, string memory document) external;

  /*//////////////////////////////////////////////////////////////////////////
                                ADMIN METHODS
    //////////////////////////////////////////////////////////////////////////*/

  function transferOwnership(address newOwner) external;
}
