import { useEffect, useState } from "react";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { RoleEnum, statusEnum } from "../../../../types/common-types";
import EmployeePayrollTable from "./EmployeePayrollTable";
import { getEmployeePayrollList } from "../../../../apis/expense/employee-payroll.api";
import StatusCards, {
  EmployeePayrollStats,
  PayrollCardItem,
} from "./StatusCards";
import MonthPicker, {
  MonthPickerValue,
} from "../../../common/date-picker/MonthPicker";
import { getFloatValue } from "../../../../utils/helper";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
  status?: statusEnum;
}

export interface IReimbursement {
  _id: string;
  name: string;
  date: string;
  amount: number;
}

export interface IPayrollTotals {
  salaryAmount: number;
  attendanceSalaryAmount: number;
  reimbursementsAmount: number;
  deductionsAmount: number;
  netPayAmount: number;
}

export interface IEmployeePayroll {
  _id: string;
  companyId: string;
  userId: IUser;
  totals: IPayrollTotals;
  generatedAt: string;
  attendance: {
    presentDays: number;
  };
  reimbursements: IReimbursement[];
}

export const initialEmployeePayroll: IEmployeePayroll = {
  _id: "",
  companyId: "",

  userId: {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    role: RoleEnum.EMPLOYEE,
  },

  totals: {
    salaryAmount: 0,
    attendanceSalaryAmount: 0,
    reimbursementsAmount: 0,
    deductionsAmount: 0,
    netPayAmount: 0,
  },

  reimbursements: [],

  generatedAt: "",

  attendance: {
    presentDays: 0,
  },
};

const EmployeePayroll: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const initialMonth: MonthPickerValue = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const [month, setMonth] = useState<MonthPickerValue>(initialMonth);

  const [employeePayrollList, setEmployeePayrollList] = useState<
    IEmployeePayroll[]
  >([]);

  const [cards, setCards] = useState<PayrollCardItem[]>([
    {
      id: "total",
      title: "Total Employee",
      count: 0,
      bgColor: "bg-[#ebeaff]",
      iconBgColor: "bg-primary",
      icon: <i className="fa-solid fa-users"></i>,
    },
    {
      id: "payrollMonth",
      title: "Month",
      count: 0,
      bgColor: "bg-[#fff0f0]",
      iconBgColor: "bg-[#ca9090]",
      icon: <i className="fa-solid fa-calendar"></i>,
    },
    {
      id: "salary",
      title: "Employee Salary",
      count: 0,
      bgColor: "bg-[#ecffeb]",
      iconBgColor: "bg-[#83b178]",
      icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
    },
    {
      id: "reimbursement",
      title: "Reimbursement Claim",
      count: 0,
      bgColor: "bg-[#fffee7]",
      iconBgColor: "bg-[#a19e5a]",
      icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
    },
  ]);

  // useEffect for get branch
  useEffect(() => {
    fetchEmployeePayrollList({ page, limit, search, ...month });
    // eslint-disable-next-line
  }, [page, limit, search, month.month]);

  // update cards
  const updateCards = (stats: EmployeePayrollStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "total":
            return { ...card, count: getFloatValue(stats.total) };

          case "payrollMonth":
            return {
              ...card,
              count: getFloatValue(stats.payrollMonth),
            };

          case "salary":
            return {
              ...card,
              count: getFloatValue(stats.salary),
            };

          case "reimbursement":
            return {
              ...card,
              count: getFloatValue(stats.reimbursement),
            };

          default:
            return card;
        }
      }),
    );
  };

  // get employee payroll list
  const fetchEmployeePayrollList = async (payload: {
    page: number;
    limit: number;
    search: string;
    month?: number;
    year?: number;
  }) => {
    setLoading(true);
    const response = await getEmployeePayrollList(payload);
    if (response.success) {
      setEmployeePayrollList(response.data?.payrolls);
      setTotal(response.data?.total);
      updateCards(response?.data);
      setLoading(false);
    } else {
      setEmployeePayrollList([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  };

  // handle search branch
  const handleOnSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  // handle Download Excel
  const handleDownloadExcel = async (password: string) => {
    await getEmployeePayrollList({
      page,
      limit,
      search,
      ...month,
      isDownload: true,
    });
  };

  // handle month change
  const handleMonthChange = (value: MonthPickerValue) => {
    setMonth(value);
  };

  return (
    <>
      <TopBar
        title="EmployeePayroll Claims"
        actionButtons={
          <div className="flex items-center gap-2 w-[150px]">
            <label className="font-medium">Month</label>
            <MonthPicker
              placeholder="Select Month"
              value={month}
              onChange={handleMonthChange}
              position="left"
            />
          </div>
        }
        isSearch
        searchPlaceholder="Search employeePayroll..."
        onSearch={handleOnSearch}
        isExcel
        handleDownloadExcel={handleDownloadExcel}
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards cards={cards} />
        <EmployeePayrollTable
          month={month}
          employeePayrolls={employeePayrollList}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
};

export default EmployeePayroll;
