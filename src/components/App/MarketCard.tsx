import React, { useState } from "react";

interface MarketCardProps {
  id: string;
  title: string;
  description?: string;
  expiration: string;
  onBet: (id: string, name: string, outcome: string, amount: number) => void;
  username: string; // Pass the username prop to save the bet history
}

const saveBetHistory = async (
  username: string,
  currentBet: {
    marketId: string;
    outcome: string;
    amount: number;
    date: string;
  },
) => {
  const response = await fetch("http://localhost:4000/api/save-bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, currentBet }), // Only the current bet
  });
  const data = await response.json();
  if (data.success) {
    console.log("Bet saved successfully");
  } else {
    console.error(data.error);
  }
};

const MarketCard: React.FC<MarketCardProps> = ({
  id,
  title,
  onBet,
  username,
}) => {
  const [outcome, setOutcome] = useState<string>("YES");
  const [amount, setAmount] = useState<number>(0);

  const handleBet = async () => {
    // Call the onBet callback to process the bet (e.g., interacting with a smart contract)
    onBet(id, title, outcome, amount);

    // Create a new bet entry
    const currentBet = {
      marketId: id,
      outcome,
      amount,
      date: new Date().toISOString(),
    };

    // Send only the current bet to the backend
    await saveBetHistory(username, currentBet);
  };

  return (
    <div className="market-card border border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition-all">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black">Outcome:</label>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 text-orange-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="YES">Yes</option>
          <option value="NO">No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black">
          Bet Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleBet}
        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
      >
        Place Bet
      </button>
    </div>
  );
};

export default MarketCard;
