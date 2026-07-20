import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { FilterCardItem, RoleEnum, statusEnum } from "../../../../types/common-types";
import { expenseStatusOptions, pathNames } from "../../../../constants/constants";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import {
  getOfficeExpenseCount,
  getOfficeExpenseList,
  updateOfficeExpenseStatus,
} from "../../../../apis/expense/office-expense.api";
import OfficeExpenseTable from "./OfficeExpenseTable";
import StatusCards, { OfficeExpenseStats } from "./StatusCards";
import MonthPicker, { MonthPickerValue } from "../../../common/date-picker/MonthPicker";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
}

export interface IBranch {
  _id: string;
  name: string;
}

export interface IVendor {
  name: string;
  company: string;
  phone: string;
  startDate: string;
  endDate: string;
  description: string;
  isOnWarranty: boolean;
}

export interface IOfficeExpense {
  _id: string;
  companyId: string;
  branchId: IBranch;
  expenseType: string;
  name: string;
  date: string;
  serviceType: string;
  description: string;
  vendor: IVendor;
  amount: number;
  paymentMode: string;
  transactionId: string;
  documents: string[];
  status: statusEnum;
  assignedBy: IUser;
  createdAt: string;
  updatedAt: string;
}

export const initialOfficeExpense: IOfficeExpense = {
  _id: "",
  companyId: "",

  branchId: {
    _id: "",
    name: "",
  },

  expenseType: "",

  name: "",

  date: "",

  serviceType: "",

  description: "",

  vendor: {
    name: "",
    company: "",
    phone: "",
    startDate: "",
    endDate: "",
    description: "",
    isOnWarranty: false,
  },

  amount: 0,

  paymentMode: "",

  transactionId: "",

  documents: [],

  status: statusEnum.PENDING,

  assignedBy: {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    role: RoleEnum.EMPLOYEE,
  },

  createdAt: "",

  updatedAt: "",
};

const OfficeExpense: React.FC = () => {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [officeExpenses, setOfficeExpenseList] = useState<IOfficeExpense[]>([]);
  
  const [officeExpense, setOfficeExpense] = useState<IOfficeExpense>(initialOfficeExpense);

  const [activeCard, setActiveCard] = useState<string>(""); 
  const initialMonth: MonthPickerValue = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }
  const [month, setMonth] = useState<MonthPickerValue>(initialMonth);
  const [cards, setCards] = useState<FilterCardItem[]>([
      {
        id: "",
        title: "Total",
        count: 0,
        amount: 0,
        activeColor: "bg-info",
        textColor: "text-info",
        icon: <i className="fa-solid fa-users"></i>,
      },
      {
        id: statusEnum.PENDING,
        title: "Pending",
        count: 0,
        amount: 0,
        activeColor: "bg-pending",
        textColor: "text-pending",
        icon: <i className="fa-solid fa-mug-hot"></i>,
      },
      {
        id: statusEnum.APPROVED,
        title: "Approved",
        count: 0,
        amount: 0,
        activeColor: "bg-success",
        textColor: "text-success",
        icon: <i className="fa-solid fa-user-plus"></i>,
      },
      {
        id: statusEnum.REJECTED,
        title: "Rejected",
        count: 0,
        amount: 0,
        activeColor: "bg-danger",
        textColor: "text-danger",
        icon: <i className="fa-solid fa-user-minus"></i>,
      },
    ]);

  // useEffect for get branch
  useEffect(() => {
    fetchOfficeExpenseList({ page, limit, search, status: activeCard,month });
  }, [page, limit, search, activeCard,month]);

  useEffect(() => {
      fetchOfficeExpenseCount();
    }, [month]);
  
    const fetchOfficeExpenseCount = async () => {
      const response = await getOfficeExpenseCount(month);
      if (response?.success) {
        updateCards(response?.data);
      }
    };
  
    // update cards
    const updateCards = (stats: OfficeExpenseStats) => {
      setCards((prev) =>
        prev.map((card) => {
          switch (card.id) {
            case "":
              return { ...card, count: stats.total, amount: stats.amount.total };
  
            case statusEnum.APPROVED:
              return { ...card, count: stats.approved, amount: stats.amount.approved };
  
            case statusEnum.PENDING:
              return { ...card, count: stats.pending, amount: stats.amount.pending };
  
            case statusEnum.REJECTED:
              return { ...card, count: stats.rejected, amount: stats.amount.rejected };
  
            default:
              return card;
          }
        }),
      );
    };

  // get branch list
  const fetchOfficeExpenseList = async (payload: {
    page: number;
    limit: number;
    search: string;
    status?: string;
    month: MonthPickerValue;
  }) => {
    setLoading(true);
    const response = await getOfficeExpenseList(payload);
    if (response.success && response.data?.officeExpenses?.length > 0) {
      setOfficeExpenseList(response.data?.officeExpenses);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setOfficeExpenseList([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(pathNames.ADD_OFFICE_EXPENSE);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setOfficeExpense(initialOfficeExpense);
  };

  // handle update status
  const handleUpdateStatus = (officeExpense: IOfficeExpense) => {
    handleStatusOpenClose();
    setOfficeExpense(officeExpense);
  };

  const handleStatusSubmit = async (formData: {
    status: statusEnum;
    remarks: string;
  }) => {
    setStatusLoading(true);

    const payload = {
      status: formData.status.trim(),
      remarks: formData.remarks,
    };

    const response = await updateOfficeExpenseStatus(payload, officeExpense._id);
    if (response.success) {
      fetchOfficeExpenseList({ page, limit, search, month, status: activeCard });
      fetchOfficeExpenseCount()
    }
    setStatusLoading(false);
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

  const handleMonthChange = (value: MonthPickerValue) => {
    setMonth(value);
  }

  return (
    <>
      <TopBar
        title="Office & Assets Expense"
        actionButtons={
          <div className="flex gap-2">
            <div className="flex items-center gap-2 w-[150px]">
              <label className="font-semibold">Month</label>
              <MonthPicker
                placeholder="Select Month"
                value={month}
                onChange={handleMonthChange}
              />
            </div>
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAdd}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
          </div>
        }
        isSearch
        searchPlaceholder="Search officeExpense..."
        onSearch={handleOnSearch}
        isExcel
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
        <OfficeExpenseTable
          officeExpenses={officeExpenses}
          handleUpdateStatus={handleUpdateStatus}
        />
        <Pagination
          totalRecords={total}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <StatusUpdateModal
        title={`expense`}
        isOpen={statusOpen}
        status={officeExpense.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
        options={expenseStatusOptions}
      />
    </>
  );
};

export default OfficeExpense;
