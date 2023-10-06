// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./interfaces/IResolver.sol";
import "./Registry.sol";

contract Resolver is IResolver {
  address public owner;
  mapping(address => Registry) registryByOwner;

  error Unauthorized();

  /*//////////////////////////////////////////////////////////////////////////
                                MODIFIERS
  //////////////////////////////////////////////////////////////////////////*/

  modifier onlyOwner() {
    if (msg.sender != owner) revert Unauthorized();
    _;
  }

  /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
  //////////////////////////////////////////////////////////////////////////*/

  constructor() {
    owner = msg.sender;
  }

  /*//////////////////////////////////////////////////////////////////////////
                                MANAGEMENT METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function createRegistry(address initialOwner) external onlyOwner returns (address) {
    Registry registry = new Registry(initialOwner);
    registryByOwner[initialOwner] = registry;

    emit CreateRegistry(initialOwner, address(registry));
    return address(registry);
  }

  function getRegistry(address registryOwner) external view returns (address) {
    return address(registryByOwner[registryOwner]);
  }

  /*//////////////////////////////////////////////////////////////////////////
                                ADMIN METHODS
  //////////////////////////////////////////////////////////////////////////*/

  function transferRegistryOwnership(address registry, address newOwner) public onlyOwner {
    Registry registryInstance = Registry(registry);

    // Effects: update the ownership on the resolver contract
    address oldOwner = registryInstance.getOwner();
    registryByOwner[newOwner] = registryInstance;
    delete registryByOwner[oldOwner];

    // Interactions: update the ownership on the registry contract
    registryInstance.transferOwnership(newOwner);
  }
}
