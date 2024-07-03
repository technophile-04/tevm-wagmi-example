import { createConfig, custom } from "wagmi";
import { hardhat } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { createMemoryClient } from "tevm";
import { createCommon, tevmDefault } from "tevm/common";

const customCommon = createCommon({
  ...tevmDefault,
  id: hardhat.id,
  loggingLevel: "warn",
  eips: [],
  hardfork: "cancun",
});
export const memoryClient = createMemoryClient({ common: customCommon });

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Create Wagmi" }),
    walletConnect({ projectId: "3a8170812b534d0ff9d794f19a901d64" }),
  ],
  ssr: true,
  transports: {
    [hardhat.id]: custom(memoryClient),
  },
  cacheTime: 0,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
