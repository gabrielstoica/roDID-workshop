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
  error NotAnAttendee();

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

  function getIdentity(bytes memory signature) external view returns (string memory) {
    bytes32 message = craftMessage();
    address attendee = recoverSigner(message, signature);

    Identity memory attendeeIdentity = identity[attendee];
    string memory did = attendeeIdentity.did;

    if (bytes(did).length == 0) revert NotAnAttendee();

    return did;
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

  /*//////////////////////////////////////////////////////////////////////////
                                     UTILS
    //////////////////////////////////////////////////////////////////////////*/

  /// @notice Splits a signature into its constituent `v`, `r`, and `s` components
  /// @param sig The signature bytes to be split
  /// @return v The recovery byte of the signature
  /// @return r The `r` component of the signature
  /// @return s The `s` component of the signature
  function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(sig.length == 65);

    assembly {
      // first 32 bytes, after the length prefix
      r := mload(add(sig, 32))
      // second 32 bytes
      s := mload(add(sig, 64))
      // final byte (first byte of the next 32 bytes)
      v := byte(0, mload(add(sig, 96)))
    }

    return (v, r, s);
  }

  /// @notice Recovers the address of the signer from the provided message and signature
  /// @dev The hashed message must be prefixed with `\x19Ethereum Signed Message:\n32`
  /// @param message The keccak256 hashed message that was signed
  /// @param sig The signature bytes from which the signer's address will be recovered
  /// @return The address of the signer that produced the provided signature
  function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

    return ecrecover(message, v, r, s);
  }

  /// @notice Prefixes the provided hash with "\x19Ethereum Signed Message:\n" + len(message) and then hashes the result
  /// @dev This is used to comply with the Ethereum's default signing scheme
  /// @return The prefixed and hashed value
  function craftMessage() internal pure returns (bytes32) {
    bytes memory message = "Sign in with Ethereum wallet to verify your identity!";
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n53", message));
  }
}
