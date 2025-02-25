// src/pages/MarketList.tsx
import MarketCard from "./MarketCard";

const markets = async () => {
  const response = await fetch("http://localhost:4000/api/markets");
  const data = await response.json();
  return data;
};

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
            title={market.title}
            onBet={onBet}
            username={""}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketList;
