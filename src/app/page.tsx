"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import App from "../components/App";
import { useBlockNumber, useAccount, useBalance } from "@starknet-react/core";

const WalletBar = dynamic(() => import("../components/WalletBar"), {
  ssr: false,
});

const Page: React.FC = () => {
  const { address: userAddress } = useAccount();
  const {
    isLoading: balanceIsLoading,
    isError: balanceIsError,
    error: balanceError,
    data: balanceData,
  } = useBalance({
    token: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    address: userAddress,
    watch: true,
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Polycoin</title>
      </Head>

      <div className="absolute top-4 right-4">
        <WalletBar />
      </div>

      {!balanceIsLoading && !balanceIsError && balanceData ? (
        <div className="absolute top-[4.5rem] right-4 p-4 w-auto max-w-md bg-white text-blue-500 border border-black">
          <p>Token: {balanceData.symbol} </p>
          <p>Balance: {Number(balanceData.formatted).toFixed(8)}</p>
        </div>
      ) : balanceIsLoading ? (
        <div className="absolute top-[4.5rem] right-4">
          <p>Loading balance...</p>
        </div>
      ) : (
        <div className="absolute top-[4.5rem] right-4">
          <p>Connecting Wallet...</p>
        </div>
      )}

      {
        <div className="relative flex flex-col items-center mt-[20rem]">
          {/* App component below the WalletBar with some margin */}
          <div className="flex flex-col items-center mt-[2rem]">
            <App />
          </div>
        </div>
      }
    </div>
  );
};

export default Page;
