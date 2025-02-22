import React, { useState } from "react";
import { MarketWithBets } from "../types";

// Function to save bet to backend
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, currentBet }), // Only the current bet
  });
  const data = await response.json();
  if (data.success) {
    console.log("Bet saved successfully");
  } else {
    console.error(data.error);
  }
};

// Props now include an `onBet` function for updating state
interface MarketCardProps extends MarketWithBets {
  username: string;
  onBet: (
    marketId: string,
    title: string,
    outcome: string,
    amount: number,
  ) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({
  id,
  title,
  bets,
  totalBetAmount,
  username,
  onBet,
}) => {
  const [outcome, setOutcome] = useState<string>("YES");
  const [amount, setAmount] = useState<number>(0);

  const handleBet = async () => {
    if (amount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    // Update state in parent
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

      {/* Betting Form */}
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

      {/* Bet History */}
      <div className="mt-4 p-3 border-t border-gray-300">
        <h3 className="text-md font-semibold text-gray-700">Bet History</h3>
        <p className="text-sm text-gray-500">
          Total Bet Amount: {totalBetAmount} STRK
        </p>

        {bets.length === 0 ? (
          <p className="text-gray-500 text-sm">No bets placed yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {bets.map((bet, index) => (
              <li key={index} className="text-gray-600 text-sm">
                {bet.user} bet {bet.amount} PolyTokens on {bet.outcome}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MarketCard;
