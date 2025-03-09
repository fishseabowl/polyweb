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
  const [loading, setLoading] = useState<boolean>(false);

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
  const handleBet = async (marketId: string, outcome: string, amount: number) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/save-bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userAddr,
          marketId,
          amount,
          outcome,
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bet.");
      }

      alert("Bet placed successfully!");

      const newBet: Bet = {
        marketId,
        user: userAddr,
        amount,
        outcome,
        date: new Date().toISOString(),
      };

      setBets((prevBets) => [...prevBets, newBet]);

      // Update the totalAmount in markets
      setMarkets((prevMarkets) =>
        prevMarkets.map((market) =>
          market.id === marketId
            ? { ...market, totalAmount: (market.totalAmount || 0) + amount }
            : market
        )
      );
    } catch (error) {
      console.error("Error placing bet:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
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
