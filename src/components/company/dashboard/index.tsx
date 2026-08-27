import { useEffect, useState } from "react";
import {
  AttendanceStatusEnum,
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
import {
  getDashboardAttendance,
  getDashboardWorkforce,
} from "../../../apis/dashboard/dashboard.api";
import PageLoader from "../../common/loader/PageLoader";
import AttendanceSummaryCard from "./AttendanceSummaryCard";
import { DateFormat, formatDate } from "../../../utils/date-format";
import { DateRangeValue } from "../../common/date-picker/DateRangePicker";
import { toastMessage } from "../../../utils/toast-message";
import useDevice from "../../../hooks/useDevice";

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

export interface IAttendanceListItem {
  _id: string;
  userId: IUserSummary;
  attendanceStatus: AttendanceStatusEnum;
}

export interface ILeaveListItem {
  _id: string;
  userId: IUserSummary;
}

export interface IAttendanceSummary {
  totalEmployee: number;
  totalLeaves: number;
  totalAbsent: number;
  totalPresent: number;
  attendanceList: IAttendanceListItem[];
  leavesList: ILeaveListItem[];
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

// attendance summary
export const initialAttendanceSummary: IAttendanceSummary = {
  totalEmployee: 0,
  totalLeaves: 0,
  totalAbsent: 0,
  totalPresent: 0,

  attendanceList: [],

  leavesList: [],
};

const Dashboard = () => {
  // page loading
  const { isMobile } = useDevice();
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);
  const [expenseLoading, setExpenseLoading] = useState<boolean>(false);

  // start and end date for expense data
  const [selected, setSelected] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const [date, setDate] = useState<string>(
    formatDate(new Date(), DateFormat.ISO_DATE),
  );
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
  ]);

  const [workforce, setWorkforce] = useState<IDashboardEmployeeOverview>(
    initialDashboardEmployeeOverview,
  );

  // attendance summary state
  const [attendanceSummary, setAttendanceSummary] =
    useState<IAttendanceSummary>(initialAttendanceSummary);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  // fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [workforceResponse, expenseResponse, attendanceResponse] =
        await Promise.all([
          getDashboardWorkforce(),
          getOverAllExpenseCount({
            startDate: formatDate(selected.startDate, DateFormat.ISO_DATE),
            endDate: formatDate(selected.endDate, DateFormat.ISO_DATE),
          }),
          getDashboardAttendance(date),
        ]);

      // workforce
      if (workforceResponse?.success) {
        updateWorkforceCards(workforceResponse.data.employee);
        setWorkforce(workforceResponse.data);
      }

      // expense
      if (expenseResponse?.success) {
        updateCards(expenseResponse.data);
      }

      // attendance
      if (attendanceResponse?.success) {
        setAttendanceSummary(attendanceResponse.data);
      } else {
        setAttendanceSummary(initialAttendanceSummary);
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch expense data by start date and end date
  const fetchExpenseData = async (selected: DateRangeValue) => {
    if (!selected.startDate || !selected.endDate) {
      toastMessage.error("Please select date range");
      return;
    }
    setExpenseLoading(true);
    const response = await getOverAllExpenseCount({
      startDate: formatDate(selected.startDate, DateFormat.ISO_DATE),
      endDate: formatDate(selected.endDate, DateFormat.ISO_DATE),
    });

    if (response?.success) {
      updateCards(response.data);
    }

    setExpenseLoading(false);
  };

  // fetch attendance data by date
  const fetchAttendanceData = async (date: string) => {
    if (!date) {
      toastMessage.error("Please select date");
      return;
    }
    setAttendanceLoading(true);
    const response = await getDashboardAttendance(date);

    if (response?.success) {
      setAttendanceSummary(response.data);
    } else {
      setAttendanceSummary(initialAttendanceSummary);
    }
    setAttendanceLoading(false);
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

          default:
            return card;
        }
      }),
    );
  };

  // handle select date range for expense
  const handleSelectDateRange = (value: DateRangeValue) => {
    setSelected(value);
    fetchExpenseData(value);
  };

  // handle change date for attendance
  const handleDateChange = (value: string) => {
    setDate(value);
    fetchAttendanceData(value);
  };

  return (
    <>
      {!isMobile && <TopBar title="Dashboard" />}
      <div className="content-area bg-dashboardBg flex flex-col gap-3">
        <PageLoader loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
          <div className="content-card">
            <EmployeeCard
              // role={RoleEnum.MANAGER}
              // employee={{
              //   name: "Harsh Kanakhara",
              //   designation: "COO",
              //   shift: "General",
              //   timing: "10:00 to 19:00",
              //   image: "/images/user.jpg",
              //   branches: ["Ahmedabad", "Baroda", "Surat"],
              //   departments: [
              //     "Account",
              //     "Production",
              //     "Human Resources",
              //     "Sales",
              //   ],
              // }}
            />
          </div>
          <ExpenseSummaryCard
            cards={cards}
            selected={selected}
            setSelected={handleSelectDateRange}
            loading={expenseLoading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkforceSummaryCard workforce={workforce} cards={workforceCards} />
          <AttendanceSummaryCard
            attendanceSummary={attendanceSummary}
            date={date}
            handleDateChange={handleDateChange}
            loading={attendanceLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
