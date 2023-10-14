"use client";

import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnecting, isConnected } = useAccount();

  const [role, setRole] = useState<string>("");
  const router = useRouter();

  const accessPage = () => {
    if (role === "attendee") {
      router.push("/attendee");
    } else if (role === "verifier") {
      router.push("/verifier");
    }
  };

  useEffect(() => {
    if (isConnected) {
      accessPage();
    }
  }, [isConnected]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-xl font-semibold text-gray-600">Sign in to your account</p>
              <fieldset>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Select your role in order to get access to the protocol methods
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex justify-center gap-x-3">
                    <div className="flex items-center gap-x-1">
                      <input
                        id="push-everything"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        onClick={() => setRole("attendee")}
                      />
                      <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                        Attendee
                      </label>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <input
                        id="push-email"
                        name="push-notifications"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        onClick={() => setRole("verifier")}
                      />
                      <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                        Verifier
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
              {!isConnected ? (
                <div className="mt-5 flex items-center justify-center">
                  {isConnecting ? <div>Connecting...</div> : <ConnectKitButton />}
                </div>
              ) : (
                role && (
                  <button
                    className="mt-5 justify-center rounded-md bg-gray-600 px-2 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    onClick={accessPage}
                  >
                    Access
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
