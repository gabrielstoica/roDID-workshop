"use client";

import { globalConfig } from "@/lib/config";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

type TIdentity = {
  did: string | null;
  address: string | null;
};

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>();

  const [identity, setIdentity] = useState<TIdentity>({
    did: null,
    address: null,
  });

  const verifyIdentity = async () => {
    setLoading(true);
    console.log(identity);
    try {
      const data = await readContract({
        address: globalConfig.registryDeployment.localhost as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "did",
                type: "string",
              },
              {
                internalType: "address",
                name: "attendee",
                type: "address",
              },
            ],
            name: "verifyIdentity",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "verifyIdentity",
        args: [identity.did, identity.address],
      });

      const result = data ? "Attendee verified!" : "Verification failed!";

      setResult(result);
    } catch (error) {
      console.log(error);
      setResult(
        `Couldn't retrieve your DID.\n Maybe your identity is not registered yet. Please contact the registry provider!`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-xl font-semibold text-gray-600">Welcome, verifier!</p>
              <div className="mt-5 flex items-center justify-center">
                <ConnectKitButton />
              </div>
              <p className="mt-5 text-sm leading-6 text-gray-600">
                Verify a DID by adding it below together with the attendee's address
              </p>
              <div className="mt-5">
                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                  DID
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="did"
                    id="did"
                    onChange={(e) => setIdentity({ ...identity, did: e.target.value })}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                  Attendee's address
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={(e) => setIdentity({ ...identity, address: e.target.value })}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <button
                className="mt-5 justify-center rounded-md bg-gray-600 px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                onClick={verifyIdentity}
                disabled={loading || !identity?.did?.length || !identity?.address?.length}
              >
                Verify DID
              </button>

              {result && <p className="mt-5 text-sm leading-6 text-gray-600">{result}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
