import { useState } from "react";
import UserSetup from "./App/UserSetup";
import Login from "./App/Login";
import MarketList from "./App/MarketList";
import BetHistory from "./App/BetHistory";
import WinnerHistory from "./App/WinnerHistory";

interface Bet {
  id: string;
  outcome: string;
  amount: number;
  name: string;
}

const App = () => {
  const [account, setAccount] = useState<string | null>(null); // Default to null if no login
  const [bets, setBets] = useState<Bet[]>([]);

  // State to store credentials
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false); // Controls account setup

  // Handle placing a bet
  const handleBet = (
    id: string,
    name: string,
    outcome: string,
    amount: number,
  ) => {
    setBets([...bets, { id, name, outcome, amount }]);
  };

  // Handle navigation to the setup page
  const handleGoToSetup = () => {
    setIsSettingUp(true);
  };

  return (
    <div className="App">
      <div className="flex flex-row gap-8">
        {/* MarketList on the left */}
        <div className="flex-1">
          <MarketList onBet={handleBet} />
        </div>

        {/* BetHistory and winners on the right */}
        <div className="flex-1 flex flex-col gap-4">
        {/* BetHistory at the top */}
      <div>
        <BetHistory bets={bets} />
      </div>

      {/* WinnerHistory below BetHistory */}
      <div>
        <WinnerHistory bets={bets} />
      </div>
    </div>
      </div>
    </div>
  );
};

export default App;
