import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import {
  FilterCardItem,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import {
  employeePathNames,
  expenseStatusOptions,
  pathNames,
} from "../../../../constants/constants";
import ReimbursementTable from "./ReimbursementTable";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import {
  getReimbursementCount,
  getReimbursementList,
  updateReimbursementStatus,
} from "../../../../apis/expense/reimbursement.api";
import StatusCards, { ReimbursementStats } from "./StatusCards";
import { useAuthStore } from "../../../../store/auth-store";
import { IUser } from "../../../../types/user.types";
import MonthPicker, {
  MonthPickerValue,
} from "../../../common/date-picker/MonthPicker";

export interface IReimbursementClaim {
  _id: string;
  branchId: string;
  reimbursementIds: string[];
}

export interface IReimbursement {
  _id: string;
  companyId: string;
  branchId: string;
  userId: IUser;
  name: string;
  date: string;
  description: string;
  amount: number;
  status: statusEnum;
  documents: string[];
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const initialReimbursement: IReimbursement = {
  _id: "",
  companyId: "",
  branchId: "",
  userId: {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    role: RoleEnum.EMPLOYEE,
  },
  name: "",
  date: "",
  description: "",
  amount: 0,
  status: statusEnum.ACCEPTED,
  documents: [],
  assignedBy: "",
  createdAt: "",
  updatedAt: "",
};
const Reimbursement: React.FC = () => {
  const { user } = useAuthStore();
  const isEmployee = user.role === RoleEnum.EMPLOYEE;
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [reimbursementList, setReimbursementList] = useState<IReimbursement[]>(
    [],
  );

  const [reimbursement, setReimbursement] =
    useState<IReimbursement>(initialReimbursement);

  const initialMonth: MonthPickerValue = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const [month, setMonth] = useState<MonthPickerValue>(initialMonth);

  const [activeCard, setActiveCard] = useState<string>("");
  const [cards, setCards] = useState<FilterCardItem[]>([
    {
      id: "",
      title: "Total",
      count: 0,
      amount: 0,
      activeColor: "bg-info",
      textColor: "text-info",
      icon: <i className="fa-solid fa-users text-xs sm:text-sm md:text-md"></i>,
    },
    {
      id: statusEnum.PENDING,
      title: "Pending",
      count: 0,
      amount: 0,
      activeColor: "bg-pending",
      textColor: "text-pending",
      icon: (
        <i className="fa-solid fa-mug-hot text-xs sm:text-sm md:text-md"></i>
      ),
    },
    {
      id: statusEnum.APPROVED,
      title: "Approved",
      count: 0,
      amount: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: (
        <i className="fa-solid fa-user-plus text-xs sm:text-sm md:text-md"></i>
      ),
    },
    {
      id: statusEnum.REJECTED,
      title: "Rejected",
      count: 0,
      amount: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: (
        <i className="fa-solid fa-user-minus text-xs sm:text-sm md:text-md"></i>
      ),
    },
  ]);

  // useEffect for get branch
  useEffect(() => {
    fetchReimbursementList({
      page,
      limit,
      search,
      status: activeCard,
      ...month,
    });
  }, [page, limit, search, activeCard, month]);

  useEffect(() => {
    fetchReimbursementCount();
    // eslint-disable-next-line
  }, [month.month]);

  const fetchReimbursementCount = async () => {
    const response = await getReimbursementCount(month);
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
  const updateCards = (stats: ReimbursementStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total, amount: stats.amount.total };

          case statusEnum.APPROVED:
            return {
              ...card,
              count: stats.approved,
              amount: stats.amount.approved,
            };

          case statusEnum.PENDING:
            return {
              ...card,
              count: stats.pending,
              amount: stats.amount.pending,
            };

          case statusEnum.REJECTED:
            return {
              ...card,
              count: stats.rejected,
              amount: stats.amount.rejected,
            };

          default:
            return card;
        }
      }),
    );
  };

  // get branch list
  const fetchReimbursementList = async (payload: {
    page: number;
    limit: number;
    search: string;
    status?: string;
    month?: number;
    year?: number;
  }) => {
    setLoading(true);
    const response = await getReimbursementList(payload);
    if (response.success && response.data?.reimbursements?.length > 0) {
      setReimbursementList(response.data?.reimbursements);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setReimbursementList([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(
      isEmployee
        ? employeePathNames.ADD_REIMBURSEMENT
        : pathNames.ADD_REIMBURSEMENT,
    );
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setReimbursement(initialReimbursement);
  };

  // handle update status
  const handleUpdateStatus = (reimbursement: IReimbursement) => {
    handleStatusOpenClose();
    setReimbursement(reimbursement);
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

    const response = await updateReimbursementStatus(
      payload,
      reimbursement._id,
    );
    if (response.success) {
      fetchReimbursementList({ page, limit, search });
      fetchReimbursementCount();
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
  };

  // handle Download Excel
  const handleDownloadExcel = async (password: string) => {
    await getReimbursementList({
      page,
      limit,
      search,
      status: "",
      isDownload: true,
      password,
    });
  };

  return (
    <>
      <TopBar
        title="Reimbursement Claims"
        actionButtons={
          <div className="flex mx-auto gap-2">
            <MonthPicker
              placeholder="Select Month"
              value={month}
              onChange={handleMonthChange}
              position="bottomCenter"
            />
            <Button
              name="Add Expense"
              size="sm"
              onClick={handleOnAdd}
              leftIcon={<i className="fa-solid fa-plus"></i>}
            />
          </div>
        }
        isSearch
        searchPlaceholder="Search reimbursement..."
        onSearch={handleOnSearch}
        isExcel
        handleDownloadExcel={handleDownloadExcel}
      />
      <div className="content-area flex flex-col gap-3">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
        <ReimbursementTable
          reimbursements={reimbursementList}
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
        status={reimbursement.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
        options={expenseStatusOptions}
      />
    </>
  );
};

export default Reimbursement;
