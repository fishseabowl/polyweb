// ✅ Market (Question) Structure
export interface Market {
  id: string; // Unique Market ID (same as question ID)
  title: string;
  description?: string;
  expiration: string;
  creator: string; // User ID of the creator
  totalAmount: number; // Sum of all bet amounts
}

// ✅ Bet Structure
export interface Bet {
  marketId: string; // Tied to a specific market/question
  user: string; // User who placed the bet
  amount: number; // Bet amount
  outcome: string; // Outcome chosen by the user
  date: string; // Timestamp when bet was placed
}

// ✅ User Bet History (optional, for frontend filtering)
export interface UserBetHistory {
  userId: string;
  bets: Bet[];
}
