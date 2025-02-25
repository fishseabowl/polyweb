interface WinnerHistoryProps {
  bets: { id: string; outcome: string; amount: number; name: string }[];
}

const WinnerHistory = ({ bets }: WinnerHistoryProps) => {
  // Filter bets to simulate winners (e.g., outcome is "YES")
  const winners = bets.filter((bet) => bet.outcome === "YES");

  return (
    <div className="winner-history">
      <h1>Winner History</h1>
      {winners.length === 0 ? (
        <p>No winners yet.</p>
      ) : (
        <ul>
          {winners.map((winner, index) => (
            <li key={index}>
              {winner.name} - Won {winner.amount} STRK
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WinnerHistory;
