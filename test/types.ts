import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Registry } from "../typechain-types";

declare module "mocha" {
  export interface Context {
    signers: Signers;
    registry: Registry;
  }
}

export interface Signers {
  deployer: SignerWithAddress;
  attendee: SignerWithAddress;
  verifier: SignerWithAddress;
}
