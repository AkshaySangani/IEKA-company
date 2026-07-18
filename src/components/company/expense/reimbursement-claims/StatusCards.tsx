import StatCard from "../../../common/statecard/StatCard";
import { FilterCardItem } from "../../../../types/common-types";
import ExpenseStatCard from "../../../common/statecard/ExpenseStatCard";

export interface ReimbursementStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  amount: Omit<ReimbursementStats, "amount">;
}
interface StatusCardsProps {
    activeCard: string;
  setActiveCard: (id: string) => void;
  cards: FilterCardItem[];
}

const StatusCards = ({ setActiveCard, activeCard, cards }: StatusCardsProps) => {

  

  const handleCardClick = (
    card: FilterCardItem
  ) => {
    setActiveCard(card.id);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {cards.map((card) => (
        <ExpenseStatCard
          key={card.id}
          count={card.count}
          title={card.title}
          icon={card.icon}
          amount={card.amount}
          active={activeCard === card.id}
          textColor={card.textColor}
          activeColor={card.activeColor}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </div>
  );
};

export default StatusCards;