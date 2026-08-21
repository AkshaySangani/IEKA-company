
import PayrollStatCard from "../../../common/statecard/PayrollCard";

export interface PayrollCardItem {
  id: string;
  title: string;
  count: string | number;
  bgColor?: string;
  iconBgColor?: string;
  textColor?: string;
  icon: React.ReactNode;
}

export interface EmployeePayrollStats {
  total: number;
  payrollMonth: number;
  salary: number;
  reimbursement: number;
}
interface StatusCardsProps {
  cards: PayrollCardItem[];
}

const StatusCards = ({ cards }: StatusCardsProps) => {

  return (
    <div className="flex flex-wrap gap-3">
      {cards.map((card) => (
        <PayrollStatCard
          key={card.id}
          count={card.count}
          title={card.title}
          icon={card.icon}
          textColor={card.textColor}
          bgColor={card.bgColor}
          iconBgColor={card.iconBgColor}
        />
      ))}
    </div>
  );
};

export default StatusCards;