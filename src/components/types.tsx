export interface MarketCardProps {
    id: string;
    title: string;
    description?: string;
    expiration: string;
}
  
// ✅ Component 1: Market with Betting Information
export interface MarketWithBets extends MarketCardProps {
    bets: { user: string; amount: number; outcome: string; }[]; // List of bets
    totalBetAmount: number; // Computed field
}
  
// ✅ Component 2: New Market Card with Creator Information
export interface MarketWithCreator extends MarketCardProps {
    creator: string; // Name of the market creator
}