import React, { useState, useEffect } from "react";
import { Market } from "./types";

const App: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch market questions from the server
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/markets");
        if (!response.ok) throw new Error("Failed to fetch market questions");

        const data: Market[] = await response.json();
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
      <h2 className="text-2xl font-bold mb-4">Market Questions</h2>

      {loading ? (
        <p>Loading market data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : markets.length === 0 ? (
        <p>No market questions available.</p>
      ) : (
        <ul className="space-y-4">
          {markets.map((market) => (
            <li key={market.id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{market.title}</h3>
              <p className="text-gray-600">Expires: {market.expiration}</p>
              <p className="text-gray-500">
                Created by: {market.creator.slice(0, 6)}...
                {market.creator.slice(-4)}
              </p>
              <p className="text-green-600 font-semibold">
                Total Bet Amount: {market.totalAmount|| 0} STRK
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
