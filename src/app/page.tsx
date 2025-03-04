"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import App from "../components/App";
import Prediction from "../components/Prediction"; // Prediction Market Page
import Question from "../components/Question"; // Q&A Section
import SideNav from "../components/SideNav"; // Import SideNav
import { useAccount, useBalance } from "@starknet-react/core";
import { useState } from "react";

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

  const [selectedPage, setSelectedPage] = useState("home");

  return (
    <div className="h-screen flex">
      {/* Sidebar Navigation */}
      <SideNav onSelect={(page) => setSelectedPage(page)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <Head>
          <title>PolyIChain</title>
        </Head>

        <div className="absolute top-4 right-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
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
        ) : balanceIsError ? (
          <div className="absolute top-[4.5rem] right-4">
            <p>Error: {balanceError?.message}</p>
          </div>
        ) : (
          <div className="absolute top-[4.5rem] right-4">
            <p>Connecting Wallet...</p>
          </div>
        )}

        <div className="relative flex flex-col items-center min-h-screen mt-12">
          <div className="flex flex-col items-center mt-4">
            {selectedPage === "home" && <App />}

            {selectedPage === "prediction" &&
              (!balanceIsLoading && !balanceIsError && balanceData ? (
                <Prediction userAddr={userAddress || ""}/>
              ) : (
                <p className="text-red-500 text-lg">
                  Please connect your wallet first.
                </p>
              ))}

            {selectedPage === "question" &&
              (!balanceIsLoading && !balanceIsError && balanceData ? (
                <Question userAddr={userAddress || ""} />
              ) : (
                <p className="text-red-500 text-lg">
                  Please connect your wallet first.
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
// Removed conflicting local useState function declaration
