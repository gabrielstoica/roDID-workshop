import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export async function signMessage(
  message: string,
  signer: SignerWithAddress,
): Promise<{ signature: string; payloadHash: string }> {
  let payload = ethers.utils.defaultAbiCoder.encode(["string"], [message]);
  let payloadHash = ethers.utils.keccak256(payload);
  let signature = await signer.signMessage(ethers.utils.arrayify(payloadHash));

  return { signature, payloadHash };
}
