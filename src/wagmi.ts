import { createConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { createMemoryClient, tevmTransport } from "tevm";
import { tevmDefault } from "tevm/common";

const memoryClient = createMemoryClient({
  common: { ...tevmDefault, id: 31337 },
});

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Create Wagmi" }),
    walletConnect({ projectId: "3a8170812b534d0ff9d794f19a901d64" }),
  ],
  ssr: true,
  transports: {
    [hardhat.id]: tevmTransport(memoryClient),
  },
  cacheTime: 0,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
