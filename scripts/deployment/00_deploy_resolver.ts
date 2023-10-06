import { ethers, hardhatArguments } from "hardhat";
import { Resolver, Resolver__factory } from "../../typechain-types";

async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("You must specify a network!");
  }

  const [resolverOwner] = await ethers.getSigners();
  const deployerBalance = await resolverOwner.getBalance();

  console.log("Resolver owner address: ", resolverOwner.address);
  console.log("Account balance:", ethers.utils.formatEther(deployerBalance));

  console.log("Waiting for Resolver contract to be deployed...");

  const resolverFactory: Resolver__factory = <Resolver__factory>(
    await ethers.getContractFactory("Resolver", resolverOwner)
  );

  const resolver: Resolver = <Resolver>await resolverFactory.deploy();
  await resolver.deployed();

  console.log(`Resolver contract address: ${resolver.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
