import { ethers } from "hardhat";
import { Registry } from "../../typechain-types";
import { deployments } from "../../config/deployments";

async function main() {
  const registry: Registry = <Registry>await ethers.getContractAt("Registry", deployments.registries.UniversityX);

  const [_, registryOwner] = await ethers.getSigners();

  const attendeeAddress = "";
  const identity = {
    attendee: attendeeAddress,
    did: `did:registry:${attendeeAddress}`,
    documents: ["ipfs://"],
  };

  console.log("Creating new identity...");
  console.log("-------------------------");

  const tx = await registry.connect(registryOwner).addIdentity(identity.attendee, identity.did, identity.documents);
  await tx.wait();

  console.log(`🎉 Successfully created new identity for ${attendeeAddress} on ${registry.address} registry!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
