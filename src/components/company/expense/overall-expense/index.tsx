import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import {
  ExpenseCardItem,
  FilterCardItem,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import StatusCards, { OverallExpenseStats } from "./StatusCards";
import { getOverAllExpenseCount } from "../../../../apis/expense/overall-expense.api";
import MonthPicker, {
  MonthPickerValue,
} from "../../../common/date-picker/MonthPicker";
import { pathNames } from "../../../../constants/constants";

export type TrendType = "high" | "low" | "same";

interface TrendResult {
  type: TrendType;
  difference: number;
  percentage: number;
}

export const getTrend = (current: number, past: number): TrendResult => {
  const difference = current - past;

  const percentage =
    past === 0 ? (current > 0 ? 100 : 0) : Math.abs((difference / past) * 100);

  return {
    type: difference > 0 ? "high" : difference < 0 ? "low" : "same",
    difference: Math.abs(difference),
    percentage: Number(percentage.toFixed(2)),
  };
};

const OverallExpense: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const initialMonth: MonthPickerValue = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const [month, setMonth] = useState<MonthPickerValue>(initialMonth);

  const [activeCard, setActiveCard] = useState<string>("");
  const [cards, setCards] = useState<ExpenseCardItem[]>([
    {
      id: pathNames.OVERALL_EXPENSE,
      title: "Total Expense",
      count: 0,
      amount: 0,
      activeColor: "bg-pendingBlur",
      textColor: "bg-pending",
      trendDetails: null,
    },
    {
      id: pathNames.REIMBURSEMENT,
      title: "Reimbursement",
      count: 0,
      amount: 0,
      activeColor: "bg-dangerBlur",
      textColor: "bg-danger",
      trendDetails: null,
    },
    {
      id: pathNames.OFFICE_EXPENSE,
      title: "Office Expense",
      count: 0,
      amount: 0,
      activeColor: "bg-successBlur",
      textColor: "bg-success",
      trendDetails: null,
    },
    {
      id: pathNames.EMPLOYEE_PAYROLL,
      title: "Employee Salary",
      count: 0,
      amount: 0,
      activeColor: "bg-yellowBlur",
      textColor: "bg-warning",
      trendDetails: null,
    },
  ]);

  useEffect(() => {
    fetchOverallExpenseCount();
  }, [month]);

  const fetchOverallExpenseCount = async () => {
    setLoading(true);
    const response = await getOverAllExpenseCount(month);
    if (response?.success) {
      updateCards(response?.data);
    }
    setLoading(false);
  };

  // update cards
  const updateCards = (stats: OverallExpenseStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case pathNames.OVERALL_EXPENSE:
            const total = getTrend(stats.total, stats.past.total);
            return { ...card, amount: stats.total,trendDetails: total };

          case pathNames.REIMBURSEMENT:
            const reimbursement = getTrend(stats.reimbursement, stats.past.reimbursement);
            return {
              ...card,
              amount: stats.reimbursement,
              trendDetails: reimbursement
            };

          case pathNames.OFFICE_EXPENSE:
            const officeExpense = getTrend(stats.officeExpense, stats.past.officeExpense);
            return {
              ...card,
              trendDetails: officeExpense,
              amount: stats.officeExpense,
            };

          case pathNames.EMPLOYEE_PAYROLL:
            const salary = getTrend(stats.salary, stats.past.salary);
            return {
              ...card,
              trendDetails: salary,
              amount: stats.salary,
            };

          default:
            return card;
        }
      }),
    );
  };

  const handleCardClick = (value: string) => {
    setActiveCard(value);
    navigate(value);
  };

  return (
    <>
      <TopBar
        title="Office & Assets Expense"
        actionButtons={
          <div className="flex items-center gap-2 w-[150px]">
            <label className="font-semibold">Month</label>
            <MonthPicker
              placeholder="Select Month"
              value={month}
              onChange={setMonth}
              position="left"
            />
          </div>
        }
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={handleCardClick}
        />
      </div>
    </>
  );
};

export default OverallExpense;
