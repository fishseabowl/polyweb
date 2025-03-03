import React, { useState } from "react";
import { Market } from "../types";

interface MarketCardProps {
  market: Market;
  username: string;
  onBet: (marketId: string, outcome: string, amount: number) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, username, onBet }) => {
  const [amount, setAmount] = useState<number>(0);
  const [selectedOutcome, setSelectedOutcome] = useState<string>("");

  const handleBet = () => {
    if (!selectedOutcome || amount <= 0) {
      alert("Please select an outcome and enter a valid amount.");
      return;
    }
    onBet(market.id, selectedOutcome, amount);
    setAmount(0);
    setSelectedOutcome("");
  };

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="text-xl font-bold">{market.title}</h3>
      <p className="text-gray-600">{market.description}</p>
      <p className="text-sm text-gray-500">Created by: {market.creator}</p>
      <p className="text-sm text-gray-500">Expires: {market.expiration}</p>

      {/* Outcome Selection */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-100">Choose Outcome:</label>
        <select
          value={selectedOutcome}
          onChange={(e) => setSelectedOutcome(e.target.value)}
          className="border p-2 w-full text-black bg-white"
        >
          <option value="">Select an outcome</option>
          <option value="YES">Yes</option>
          <option value="NO">No</option>
        </select>
      </div>

      {/* Bet Amount Input */}
      <div className="mt-2">
        <label className="block text-sm font-medium">Bet Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            setAmount(newValue >= 0 ? newValue : 0); // Ensure non-negative values
          }}
          className="border p-2 w-full text-blue-600 bg-white"
          min="0"
        />
      </div>

      {/* Bet Button */}
      <button
        onClick={handleBet}
        className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
      >
        Place Bet
      </button>
    </div>
  );
};

export default MarketCard;
