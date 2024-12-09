// src/pages/MarketList.tsx
import { useState } from "react";
import MarketCard from "./MarketCard";

const markets = [
  { id: "1", name: "Bitcoin is above $100,000 in December/30/2024" },
  { id: "2", name: "Ethereum is above $3,500 in December/30/2024" },
  { id: "3", name: "Solana is above $300 in December/30/2024" },
];

interface MarketListProps {
  onBet: (id: string, name: string, outcome: string, amount: number) => void;
}

const MarketList = ({ onBet }: MarketListProps) => {
  return (
    <div className="market-list p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
        Available Markets
      </h1>
      <div className="flex flex-col gap-4 overflow-x-auto">
        {markets.map((market) => (
          <MarketCard
            key={market.id}
            id={market.id}
            name={market.name}
            onBet={onBet}
            username={""}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketList;
