import { ethers, hardhatArguments } from "hardhat";
import { Box, Box__factory } from "../../typechain-types";

async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("You must specify a network!");
  }

  const [deployer] = await ethers.getSigners();
  const deployerBalance = await deployer.getBalance();

  console.log("Deploying from address: ", deployer.address);
  console.log("Account Balance:", ethers.utils.formatEther(deployerBalance));

  console.log("Waiting for Box contract to be deployed...");

  const boxFactory: Box__factory = <Box__factory>await ethers.getContractFactory("Box", deployer);

  const box: Box = <Box>await boxFactory.deploy();
  await box.deployed();

  console.log("Box contract address: ", box.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
