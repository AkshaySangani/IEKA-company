import StatCard from "../../../common/statecard/StatCard";
import { FilterCardItem } from "../../../../types/common-types";

export interface PromotionStats {
  total: number;
  cancel: number;
  promoted: number;
  hold: number;
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
    <div className="flex gap-3">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          count={card.count}
          title={card.title}
          icon={card.icon}
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