// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRegistry {
  /*//////////////////////////////////////////////////////////////////////////
                                EVENTS
  //////////////////////////////////////////////////////////////////////////*/

  event AddIdentity(address indexed attendee, address owner, string did, string[] documents);
  event AddIdentityDocument(address indexed attendee, string document);
  event UpdateIdentityStatus(address indexed attendee, bool newStatus);
  event TransferOwnership(address indexed oldOwner, address indexed newOwner);

  /*//////////////////////////////////////////////////////////////////////////
                                MANAGEMENT METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function addIdentity(address attendee, string memory did, string[] memory documents) external;

  function updateIdentityStatus(address attendee, bool newStatus) external;

  function addIdentityDocument(address attendee, string memory document) external;

  /*//////////////////////////////////////////////////////////////////////////
                                PUBLIC FACING METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function getOwner() external view returns (address);

  /*//////////////////////////////////////////////////////////////////////////
                                ADMIN METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function transferOwnership(address newOwner) external;
}
