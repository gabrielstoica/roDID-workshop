"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { FC, PropsWithChildren } from "react";
import { localhost } from "viem/chains";
import { WagmiConfig, createConfig } from "wagmi";

const chains = [localhost];

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.INFURA_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID!,

    // Required
    appName: "roDID-workshop",

    // Optional
    appDescription: "Simple Next.js for the roDID workshop",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains,
  }),
);

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="midnight">{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};
export default ClientLayout;
