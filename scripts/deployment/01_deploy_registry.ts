import { ethers, hardhatArguments } from "hardhat";
import { Registry, Registry__factory, Resolver } from "../../typechain-types";
import { deployments } from "../../config/deployments";

async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("You must specify a network!");
  }

  if (!deployments.resolver) {
    throw new Error("Resolver not specificed");
  }
  const [resolverOwner, registryOwner] = await ethers.getSigners();
  const deployerBalance = await registryOwner.getBalance();

  console.log("Registry owner address: ", registryOwner.address);
  console.log("Account balance:", ethers.utils.formatEther(deployerBalance));

  console.log("Waiting for Registry contract to be deployed...");

  const resolver: Resolver = <Resolver>await ethers.getContractAt("Resolver", deployments.resolver, resolverOwner);

  const tx = await resolver.createRegistry(registryOwner.address);
  const registry = await tx.wait(1);

  const registryAddress = await resolver.getRegistry(registryOwner.address);
  console.log(registryAddress);

  console.log(`Registry contract address: ${registry.logs[0].address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
