import { useState, useEffect } from "react";
import MarketCard from "./App/MarketCard";
import BetHistory from "./App/BetHistory";
import WinnerHistory from "./App/WinnerHistory";
import { Market, Bet } from "./types";

interface PredictionProps {
  userAddr: string; // Get username from Page.tsx
}

const Prediction : React.FC<PredictionProps> = ({ userAddr }) =>  {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  // Fetch available markets
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/markets");
        if (!response.ok) throw new Error("Failed to fetch markets");
        const data = await response.json();
        setMarkets(data);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarkets();
  }, []);

  // Handle placing a bet
  const handleBet = (marketId: string, outcome: string, amount: number) => {
    const newBet: Bet = {
      marketId,
      user: userAddr,
      amount,
      outcome,
      date: new Date().toISOString(),
    };
    setBets([...bets, newBet]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Market Predictions</h2>

      {/* Show available markets */}
      {markets.length === 0 ? (
        <p className="text-gray-500">No market predictions available.</p>
      ) : (
        <div>
          {markets.map((market) => (
            <button
              key={market.id}
              className="block p-2 border rounded mb-2"
              onClick={() => setSelectedMarket(market)}
            >
              {market.title}
            </button>
          ))}
        </div>
      )}

      {/* Show selected market */}
      {selectedMarket && (
        <MarketCard
          market={selectedMarket}
          username={userAddr}
          onBet={handleBet}
        />
      )}

      {/* Bet and Winner History */}
      <BetHistory bets={bets} markets={markets} />
      <WinnerHistory bets={bets} markets={markets} />
    </div>
  );
};

export default Prediction;
