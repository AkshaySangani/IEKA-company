import { currency } from "../../../../constants/constants";
import { FilterCardItem } from "../../../../types/common-types";

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

const StatusCards = ({
  setActiveCard,
  activeCard,
  cards,
}: StatusCardsProps) => {
  const handleCardClick = (card: FilterCardItem) => {
    setActiveCard(card.id);
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          onClick={() => handleCardClick(card)}
          className="content-card border border-gray-200  p-5 transition-all duration-200 hover:-translate-y-[5px] cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>

              <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                ₹{card.amount}
              </h3>
            </div>

            {/* Amount + Icon */}

            <div
              className={`flex h-12 w-12 text-2xl items-center justify-center rounded-full ${card.textColor} font-semibold`}
            >
              {currency.INR}
            </div>
          </div>

          {/* Footer */}
          {card.trendDetails && (
            <div className="flex items-center gap-2 mt-5">
              <span
                className={`text-[22px] font-bold ${
                  card.trendDetails.type === "high"
                    ? "text-success"
                    : card.trendDetails.type === "low"
                      ? "text-error"
                      : "text-secondary"
                }`}
              >
                {card.trendDetails.type === "high"
                  ? "↑"
                  : card.trendDetails.type === "low"
                    ? "↓"
                    : "→"}
              </span>

              <span
                className={`text-[16px] font-medium ${
                  card.trendDetails.type === "high"
                    ? "text-success"
                    : card.trendDetails.type === "low"
                      ? "text-error"
                      : "text-secondary"
                }`}
              >
                {card.trendDetails.type === "high" ? "+" : ""}
                {card.trendDetails.percentage}%
              </span>

              <span className="text-xs text-secondary">Last Month</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusCards;
