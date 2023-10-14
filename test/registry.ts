import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Signers } from "./types";
import { Registry, Registry__factory } from "../typechain-types";
import { hashMessage } from "ethers/lib/utils";
import { signMessage } from "./utils";

describe("Registry tests", function () {
  let signers: Signers = {} as Signers;
  let registry: Registry;
  let message: string;

  before(async function () {
    const _signers: SignerWithAddress[] = await ethers.getSigners();

    signers.deployer = _signers[0];
    signers.attendee = _signers[1];
    signers.verifier = _signers[2];
    message = "Sign in with Ethereum wallet to verify your identity!";
  });

  describe("signature verification", function () {
    this.beforeEach(async function () {
      const registryFactory: Registry__factory = <Registry__factory>(
        await ethers.getContractFactory("Registry", signers.deployer.address)
      );

      registry = await registryFactory.deploy(signers.deployer.address);
      await registry.deployed();

      const identity = {
        attendee: signers.attendee.address,
        did: `did:registry:${signers.attendee.address}`,
        documents: ["ipfs://Qme3n4rQ2f4nBq2AUGTadvEwJvpGeE2EsUVPefsA94bh3U"],
      };

      const tx = await registry
        .connect(signers.deployer)
        .addIdentity(identity.attendee, identity.did, identity.documents);
      await tx.wait();
    });

    it("should get the attendee's identity", async function () {
      //const { signature, payloadHash } = await signMessage(message, signers.attendee);
      const signature = await signers.attendee.signMessage(message);
      const identity = await registry.connect(signers.attendee).getIdentity(message, signature);
      console.log(identity);
    });
  });
});
