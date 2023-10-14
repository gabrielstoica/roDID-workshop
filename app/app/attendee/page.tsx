"use client";

import { globalConfig } from "@/lib/config";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { signMessage, readContract } from "@wagmi/core";
import { Copy } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [did, setDid] = useState<string>();

  const messageToSign = "Sign in with Ethereum wallet to verify your identity!";

  const getAttendeeDid = async () => {
    setLoading(true);
    const signature = await signMessage({ message: messageToSign });

    try {
      const data = await readContract({
        address: globalConfig.registryDeployment.localhost as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "message",
                type: "string",
              },
              {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
              },
            ],
            name: "getIdentity",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getIdentity",
        args: [messageToSign, signature],
      });

      setDid(data as string);
    } catch (error) {
      console.log(error);
      setError(
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
              <p className="text-xl font-semibold text-gray-600">Welcome, attendee!</p>
              <div className="mt-5 flex items-center justify-center">
                <ConnectKitButton />
              </div>
              <p className="mt-5 text-sm leading-6 text-gray-600">Get your DID by executing the following method:</p>
              <button
                className="mt-5 justify-center rounded-md bg-gray-600 px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                onClick={getAttendeeDid}
                disabled={loading || !!did?.length}
              >
                Get DID
              </button>
              {did && (
                <div>
                  <p className="truncate mt-5 text-sm leading-6 text-gray-600">{did}</p>
                  <button
                    className="justify-center rounded-md bg-gray-600 px-2 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    onClick={() => {
                      navigator.clipboard.writeText(did);
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
              {error && <p className="mt-5 text-sm leading-6 text-gray-600">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
