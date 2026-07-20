import { FilterCardItem } from "../../../../types/common-types";
import OverallExpenseCard from "../../../common/statecard/OverallExpenseCard";

export interface OverallExpenseStats {
  total: number;
  officeExpense: number;
  reimbursement: number;
  salary: number;
  past: Omit<OverallExpenseStats, "amount">;
}
interface StatusCardsProps {
    activeCard: string;
  setActiveCard: (id: string) => void;
  cards: any[];
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
        <OverallExpenseCard
          key={card.id}
          title={card.title}
          trendDetails={card.trendDetails}
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