// src/pages/BetHistory.tsx
interface BetHistoryProps {
  bets: { id: string; outcome: string; amount: number; name: string }[];
}

const BetHistory = ({ bets }: BetHistoryProps) => {
  return (
    <div className="bet-history">
      <h1>Your Previous Bets</h1>
      {bets.length === 0 ? (
        <p>No bets placed yet.</p>
      ) : (
        <ul>
          {bets.map((bet, index) => (
            <li key={index}>
              {bet.name} - Bet {bet.outcome} with {bet.amount} ETH
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BetHistory;
