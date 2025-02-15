import React from "react";

type Question = {
  title: string;
  description: string;
  expiration: string;
  totalBids: number;
  highestBid: number;
};

type AppProps = {
  questions: Question[];
};

const App: React.FC<AppProps> = ({ questions }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Question Bid Summary</h2>

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions have been submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q, index) => (
            <li key={index} className="p-4 border rounded shadow-lg bg-white">
              <h3 className="text-lg font-semibold">{q.title}</h3>
              <p className="text-gray-600">{q.description}</p>
              <p className="text-sm text-gray-500">Expires on: {q.expiration}</p>
              <div className="mt-2 text-blue-600">
                <p>Total Bids: {q.totalBids}</p>
                <p>Highest Bid: {q.highestBid} PolyTokens</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
