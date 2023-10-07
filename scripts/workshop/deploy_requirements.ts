import { ethers, hardhatArguments } from "hardhat";
import { Registry, Resolver, Resolver__factory } from "../../typechain-types";

async function main() {
  const { network } = hardhatArguments;
  if (!network) {
    throw new Error("You must specify a network!");
  }

  const [resolverOwner, registryOwner, attendee, verifier] = await ethers.getSigners();
  const deployerBalance = await resolverOwner.getBalance();

  console.log("Resolver owner address: ", resolverOwner.address);
  console.log("Account balance:", ethers.utils.formatEther(deployerBalance));

  /*//////////////////////////////////////////////////////////////////////////
                                DEPLOY RESOLVER
  //////////////////////////////////////////////////////////////////////////*/

  console.log("Waiting for Resolver contract to be deployed...");

  const resolverFactory: Resolver__factory = <Resolver__factory>(
    await ethers.getContractFactory("Resolver", resolverOwner)
  );

  const resolver: Resolver = <Resolver>await resolverFactory.deploy();
  await resolver.deployed();

  console.log(`Resolver contract address: ${resolver.address}`);

  /*//////////////////////////////////////////////////////////////////////////
                                CREATE REGISTRY
  //////////////////////////////////////////////////////////////////////////*/

  console.log("Creating a new Registry contract...");

  let tx = await resolver.createRegistry(registryOwner.address);
  const registryReceipt = await tx.wait();

  const registry: Registry = <Registry>await ethers.getContractAt("Registry", registryReceipt.logs[0].address);
  console.log(`Registry contract address: ${registry.address}`);

  /*//////////////////////////////////////////////////////////////////////////
                                CREATE IDENTITY
  //////////////////////////////////////////////////////////////////////////*/

  const identity = {
    attendee: attendee.address,
    did: `did:registry:${attendee.address}`,
    documents: ["ipfs://Qme3n4rQ2f4nBq2AUGTadvEwJvpGeE2EsUVPefsA94bh3U"],
  };

  console.log(`Creating new identity for ${attendee.address}...`);
  console.log("-------------------------------------------------");

  tx = await registry.connect(registryOwner).addIdentity(identity.attendee, identity.did, identity.documents);
  await tx.wait();

  console.log(`🎉 Successfully created new identity for ${attendee.address} on ${registry.address} registry!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
