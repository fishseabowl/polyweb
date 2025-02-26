import { Bet, Market } from "../types";

interface BetHistoryProps {
  bets: Bet[];
  markets: Market[]; // Available markets to display titles
}

const BetHistory = ({ bets, markets }: BetHistoryProps) => {
  const getMarketTitle = (marketId: string) => {
    const market = markets.find((m) => m.id === marketId);
    return market ? market.title : "Unknown Market";
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Your Previous Bets</h2>
      {bets.length === 0 ? (
        <p className="text-gray-500">No bets placed yet.</p>
      ) : (
        <ul className="space-y-2">
          {bets.map((bet, index) => (
            <li key={index} className="p-2 border rounded">
              <strong>{getMarketTitle(bet.marketId)}</strong> - Bet{" "}
              <span className="font-bold">{bet.outcome}</span> with{" "}
              <span className="font-bold">{bet.amount} STRK</span>
              <span className="text-gray-400 text-sm">
                {" "}
                (Placed on {bet.date})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BetHistory;
