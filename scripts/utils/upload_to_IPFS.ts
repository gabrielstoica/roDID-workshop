import { create } from "ipfs-http-client";

async function main() {
  const project_id = process.env.INFURA_API_KEY_IPFS;
  const project_secret = process.env.INFURA_API_SECRET_IPFS;

  const authorization = "Basic " + btoa(project_id + ":" + project_secret);

  const client = create({
    url: "https://ipfs.infura.io:5001",
    headers: { authorization },
    timeout: 100000,
  });

  const attendeeAddress = "";

  const document = {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
    id: "did:registry:123456789abcdefghi",
    authentication: [
      {
        id: `did:registry:${attendeeAddress}`,
        type: "EcdsaSecp256k1RecoveryMethod2020",
        controller: `did:registry:${attendeeAddress}`,
        blockchainAccountId: `eip155:1:${attendeeAddress}`,
      },
    ],
  };

  const metadata = JSON.stringify(document, null, 2);
  const ipfs = await client.add(metadata);

  console.log(ipfs);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
