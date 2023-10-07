import { ethers } from "hardhat";
import { Registry } from "../../typechain-types";
import { deployments } from "../../config/deployments";

async function main() {
  const registry: Registry = <Registry>await ethers.getContractAt("Registry", deployments.registries.UniversityX);

  const [_, registryOwner, attendee] = await ethers.getSigners();

  const identity = {
    attendee: attendee.address,
    did: `did:registry:${attendee.address}`,
    documents: ["ipfs://Qme3n4rQ2f4nBq2AUGTadvEwJvpGeE2EsUVPefsA94bh3U"],
  };

  console.log("Creating new identity...");
  console.log("-------------------------");

  const tx = await registry.connect(registryOwner).addIdentity(identity.attendee, identity.did, identity.documents);
  await tx.wait();

  console.log(`🎉 Successfully created new identity for ${attendee.address} on ${registry.address} registry!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
