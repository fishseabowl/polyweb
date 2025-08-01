// ✅ Market (Question) Structure
export interface Market {
  id: string; // Unique Market ID (same as question ID)
  title: string;
  description?: string;
  expiration: string;
  creator: `0x${string}` | undefined; // User ID of the creator
  bets: Bet[]; // Associated bets
  totalAmount: number; // Sum of all bet amounts
}

// ✅ Bet Structure
export interface Bet {
  marketId: string; // Tied to a specific market/question
  user: `0x${string}` | undefined; // User who placed the bet
  amount: number; // Bet amount
  outcome: string; // Outcome chosen by the user
  date: string; // Timestamp when bet was placed
}

// ✅ User Bet History (optional, for frontend filtering)
export interface UserBetHistory {
  userId: `0x${string}` | undefined;
  bets: Bet[];
}
