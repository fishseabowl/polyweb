import { Bet, Market } from "../types";

interface WinnerHistoryProps {
  bets: Bet[];
  markets: Market[]; // Available markets to display titles
}

const WinnerHistory = ({ bets, markets }: WinnerHistoryProps) => {
  // Define winning criteria (e.g., outcome === "YES")
  const winners = bets.filter((bet) => bet.outcome === "YES");

  const getMarketTitle = (marketId: string) => {
    const market = markets.find((m) => m.id === marketId);
    return market ? market.title : "Unknown Market";
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Winner History</h2>
      {winners.length === 0 ? (
        <p className="text-gray-500">No winners yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {winners.map((winner, index) => (
            <li key={index} className="text-green-600 font-medium">
              {getMarketTitle(winner.marketId)} - {winner.user} won{" "}
              {winner.amount} STRK
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WinnerHistory;
