import React, { useState, useEffect } from "react";
import { MarketWithBets } from "./types";

const App: React.FC = () => {
  const [markets, setMarkets] = useState<MarketWithBets[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch market data from server
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/questions");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setMarkets(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Market Summary</h2>

      {loading ? (
        <p className="text-gray-500">Loading markets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : markets.length === 0 ? (
        <p className="text-gray-500">No markets available.</p>
      ) : (
        <ul className="space-y-4">
          {markets.map((market) => (
            <li
              key={market.id}
              className="p-4 border rounded shadow-lg bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-600">{market.title}</h3>
              <p className="text-gray-400">
                {market.description || "No description provided."}
              </p>
              <p className="text-sm text-gray-500">
                Expires on: {market.expiration}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                Total Bet Amount: {market.totalBetAmount || 0} STAK
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
