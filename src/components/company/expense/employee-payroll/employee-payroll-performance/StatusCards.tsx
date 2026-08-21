import { FilterCardItem } from "../../../../../types/common-types";
import StatCard from "../../../../common/statecard/StatCard";


export interface AttendanceStats {
  total: number;
  absent: number;
  leave: number;
  present: number;
  holiday: number;
  weekOff: number;
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
          className="min-w-[80px] "
        />
      ))}
    </div>
  );
};

export default StatusCards;