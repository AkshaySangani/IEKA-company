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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
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