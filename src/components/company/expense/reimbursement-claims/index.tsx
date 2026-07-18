import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import { FilterCardItem, RoleEnum, statusEnum } from "../../../../types/common-types";
import { expenseStatusOptions, pathNames } from "../../../../constants/constants";
import ReimbursementTable from "./ReimbursementTable";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import {
  getReimbursementCount,
  getReimbursementList,
  updateReimbursementStatus,
} from "../../../../apis/expense/reimbursement.api";
import StatusCards, { ReimbursementStats } from "./StatusCards";

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

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
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
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [reimbursementList, setReimbursementList] = useState<IReimbursement[]>([]);
  
  const [reimbursement, setReimbursement] = useState<IReimbursement>(initialReimbursement);

  const [activeCard, setActiveCard] = useState<string>(""); 
  const [cards, setCards] = useState<FilterCardItem[]>([
      {
        id: "",
        title: "Total",
        count: 0,
        amount: 10000,
        activeColor: "bg-info",
        textColor: "text-info",
        icon: <i className="fa-solid fa-users"></i>,
      },
      {
        id: statusEnum.PENDING,
        title: "Pending",
        count: 0,
        amount: 10000,
        activeColor: "bg-pending",
        textColor: "text-pending",
        icon: <i className="fa-solid fa-mug-hot"></i>,
      },
      {
        id: statusEnum.APPROVED,
        title: "Approved",
        count: 0,
        amount: 10000,
        activeColor: "bg-success",
        textColor: "text-success",
        icon: <i className="fa-solid fa-user-plus"></i>,
      },
      {
        id: statusEnum.REJECTED,
        title: "Rejected",
        count: 0,
        amount: 10000,
        activeColor: "bg-danger",
        textColor: "text-danger",
        icon: <i className="fa-solid fa-user-minus"></i>,
      },
    ]);

  // useEffect for get branch
  useEffect(() => {
    fetchReimbursementList({ page, limit, search, status: activeCard });
  }, [page, limit, search, activeCard]);

  useEffect(() => {
      fetchReimbursementCount();
    }, []);
  
    const fetchReimbursementCount = async () => {
      const response = await getReimbursementCount({});
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
  const fetchReimbursementList = async (payload: {
    page: number;
    limit: number;
    search: string;
    status?: string;
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
    navigate(pathNames.ADD_REIMBURSEMENT);
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

    const response = await updateReimbursementStatus(payload, reimbursement._id);
    if (response.success) {
      fetchReimbursementList({ page, limit, search });
      fetchReimbursementCount()
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

  return (
    <>
      <TopBar
        title="Reimbursement Claims"
        actionButtons={
          <Button
            name="Add New"
            size="sm"
            onClick={handleOnAdd}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search reimbursement..."
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
