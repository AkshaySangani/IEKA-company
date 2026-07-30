import { useEffect, useState } from "react";
import {
  ExpenseCardItem,
  FilterCardItem,
  RoleEnum,
  statusEnum,
} from "../../../types/common-types";
import TopBar from "../../common/topbar/TopBar";
import EmployeeCard from "./EmployeeCard";
import { pathNames } from "../../../constants/constants";
import ExpenseSummaryCard from "./ExpenseSummaryCard";
import { getOverAllExpenseCount } from "../../../apis/expense/overall-expense.api";
import { OverallExpenseStats } from "../expense/overall-expense/StatusCards";
import { getTrend } from "../expense/overall-expense";
import WorkforceSummaryCard from "./WorkforceSummaryCard";
import { EmployeeStats } from "../workforce/all-employees/StatusCards";
import { getDashboardWorkforce } from "../../../apis/dashboard/dashboard.api";
import PageLoader from "../../common/loader/PageLoader";

export interface IUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

export interface IEmployeeStats {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}

export interface IUserListStats {
  count: number;
  list: IUserSummary[];
}

export interface IDashboardEmployeeOverview {
  employee: IEmployeeStats;
  onboarding: IUserListStats;
  resignation: IUserListStats;
  termination: IUserListStats;
  promotion: IUserListStats;
}

export const initialDashboardEmployeeOverview: IDashboardEmployeeOverview = {
  employee: {
    total: 0,
    active: 0,
    inactive: 0,
    deleted: 0,
  },

  onboarding: {
    count: 0,
    list: [],
  },

  resignation: {
    count: 0,
    list: [],
  },

  termination: {
    count: 0,
    list: [],
  },

  promotion: {
    count: 0,
    list: [],
  },
};

const Dashboard = () => {
  const [selected, setSelected] = useState<Date>();
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<ExpenseCardItem[]>([
    {
      id: pathNames.OVERALL_EXPENSE,
      title: "Total Expense",
      count: 0,
      amount: 0,
      activeColor: "#fff0f0",
      textColor: "bg-pending",
      trendDetails: null,
    },
    {
      id: pathNames.REIMBURSEMENT,
      title: "Reimbursement",
      count: 0,
      amount: 0,
      activeColor: "#fff0f0",
      textColor: "bg-danger",
      trendDetails: null,
    },
    {
      id: pathNames.OFFICE_EXPENSE,
      title: "Office Expense",
      count: 0,
      amount: 0,
      activeColor: "#ecffeb",
      textColor: "bg-success",
      trendDetails: null,
    },
    {
      id: pathNames.EMPLOYEE_PAYROLL,
      title: "Employee Salary",
      count: 0,
      amount: 0,
      activeColor: "#fffaf0",
      textColor: "bg-warning",
      trendDetails: null,
    },
  ]);
  const [workforceCards, setWorkforceCards] = useState<FilterCardItem[]>([
    {
      id: "",
      title: "Total",
      count: 0,
      activeColor: "bg-info",
      textColor: "text-info",
      icon: <i className="fa-solid fa-align-justify"></i>,
    },
    {
      id: "ACTIVE",
      title: "Active",
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <i className="fa-solid fa-user-check"></i>,
    },
    {
      id: "INACTIVE",
      title: "Inactive",
      count: 0,
      activeColor: "bg-warning",
      textColor: "text-warning",
      icon: <i className="fa-solid fa-user-xmark"></i>,
    },
    {
      id: "DELETED",
      title: "Deleted",
      count: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: <i className="fa-solid fa-trash-can"></i>,
    },
  ]);
  const [workforce, setWorkforce] = useState<IDashboardEmployeeOverview>(initialDashboardEmployeeOverview);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  setLoading(true);

  try {
    const [expenseResponse, workforceResponse] = await Promise.all([
      getOverAllExpenseCount({ month: 7, year: 2026 }),
      getDashboardWorkforce(),
    ]);

    if (expenseResponse?.success) {
      updateCards(expenseResponse.data);
    }

    if (workforceResponse?.success) {
      updateWorkforceCards(workforceResponse.data.employee);
      setWorkforce(workforceResponse.data);
    }
  } catch (error) {
    console.error("Dashboard API Error:", error);
  } finally {
    setLoading(false);
  }
};

  const updateCards = (stats: OverallExpenseStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case pathNames.OVERALL_EXPENSE:
            const total = getTrend(stats.total, stats.past.total);
            return { ...card, amount: stats.total, trendDetails: total };

          case pathNames.REIMBURSEMENT:
            const reimbursement = getTrend(
              stats.reimbursement,
              stats.past.reimbursement,
            );
            return {
              ...card,
              amount: stats.reimbursement,
              trendDetails: reimbursement,
            };

          case pathNames.OFFICE_EXPENSE:
            const officeExpense = getTrend(
              stats.officeExpense,
              stats.past.officeExpense,
            );
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
  const updateWorkforceCards = (stats: EmployeeStats) => {
    setWorkforceCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case statusEnum.ACTIVE:
            return { ...card, count: stats.active };

          case statusEnum.INACTIVE:
            return { ...card, count: stats.inactive };

          case statusEnum.DELETED:
            return { ...card, count: stats.deleted };

          default:
            return card;
        }
      }),
    );
  };

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="content-area bg-dashboardBg flex flex-col gap-3">
        <PageLoader loading={loading} />
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-4">
          <div className="content-card">
            <EmployeeCard
              role={RoleEnum.MANAGER}
              employee={{
                name: "Harsh Kanakhara",
                designation: "COO",
                shift: "General",
                timing: "10:00 to 19:00",
                image: "/images/user.jpg",
                branches: ["Ahmedabad", "Baroda", "Surat"],
                departments: [
                  "Account",
                  "Production",
                  "Human Resources",
                  "Sales",
                ],
              }}
            />
          </div>
          <ExpenseSummaryCard cards={cards} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WorkforceSummaryCard workforce={workforce} cards={workforceCards} />
          <div className="content-card"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
