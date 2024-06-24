"use client";

import { config, memoryClient } from "@/wagmi";
import { parseEther } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { getBlockNumber } from "wagmi/actions";

const NUM_OF_ETH = "1";
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const sendETH = async () => {
    if (!account.address) return;

    await memoryClient.tevmCall({
      from: FAUCET_ADDRESS,
      to: account.address,
      value: parseEther(NUM_OF_ETH),
      createTransaction: "on-success",
    });

    const chainId = await memoryClient.getChainId();
    console.log("the chain id is", chainId);

    const mineResult = await memoryClient.tevmMine();
    console.log("⛏ ~ file: FaucetButton.tsx:sendETH ~ mineResult", mineResult);

    if (mineResult.errors) throw new Error("Failed to mine");

    const blockNumber = await memoryClient.getBlockNumber();
    const blockNumber2 = await getBlockNumber(config);

    console.log(
      "⛏ ~ file: FaucetButton.tsx:sendETH ~ blockNumber",
      blockNumber,
    );
    console.log(
      "⛏ ~ file: FaucetButton.tsx:sendETH ~ wagmi blockNumber",
      blockNumber2,
    );
    console.log("ETH sent to address", account.address);

    try {
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
    }
  };

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        <button onClick={sendETH}>Faucet</button>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default App;
