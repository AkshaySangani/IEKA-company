import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import {
  FilterCardItem,
  LeaveDuration,
  statusEnum,
} from "../../../../types/common-types";
import { pathNames } from "../../../../constants/constants";
import LeaveRequestTable from "./LeaveRequestTable";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "../../../common/modal/StatusModal";
import {
  getLeaveRequestCount,
  getLeaveRequestList,
  updateLeaveRequestStatus,
} from "../../../../apis/performance/leave-request.api";
import StatusCards, { LeaveStats } from "./StatusCards";
import { IUser } from "../../../../types/user.types";

export interface ILeaveRequest {
  _id: string;
  userId: IUser;
  leaveId: string;
  startDate: string;
  endDate: string;
  duration: LeaveDuration;
  totalDays: number;
  reason: string;
  status: statusEnum;
  approvedBy: string | null;
  approvedAt: string | null;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export const initialLeaveRequest: ILeaveRequest = {
  _id: "",
  userId: {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    role: "",
  },
  leaveId: "",
  startDate: "",
  endDate: "",
  duration: LeaveDuration.FULL_DAY,
  totalDays: 0,
  reason: "",
  status: statusEnum.PENDING,
  approvedBy: null,
  approvedAt: null,
  remarks: "",
  createdAt: "",
  updatedAt: "",
};

const LeaveRequest: React.FC = () => {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [leaveList, setLeaveRequestList] = useState<ILeaveRequest[]>([]);
  const [leave, setLeaveRequest] = useState<ILeaveRequest>(initialLeaveRequest);

  const [activeCard, setActiveCard] = useState<string>("");

  const [cards, setCards] = useState<FilterCardItem[]>([
    {
      id: "",
      title: "Total",
      count: 0,
      activeColor: "bg-info",
      textColor: "text-info",
      icon: <i className="fa-solid fa-align-justify"></i>,
    },
    {
      id: statusEnum.PENDING,
      title: "Pending",
      count: 0,
      activeColor: "bg-pending",
      textColor: "text-pending",
      icon: <i className="fa-solid fa-hourglass-end"></i>,
    },
    {
      id: statusEnum.APPROVED,
      title: "Approved",
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <i className="fa-solid fa-user-check"></i>,
    },
    {
      id: statusEnum.REJECTED,
      title: "Rejected",
      count: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: <i className="fa-solid fa-user-times"></i>,
    },
  ]);
  // useEffect for get branch
  useEffect(() => {
    fetchLeaveRequestList({ page, limit, search, status: activeCard });
    // eslint-disable-next-line
  }, [page, limit, search, activeCard]);

  // get branch list
  const fetchLeaveRequestList = async (payload: {
    page: number;
    limit: number;
    search: string;
    status?: statusEnum | string;
  }) => {
    setLoading(true);
    const response = await getLeaveRequestList(payload);
    if (response.success && response.data?.leaves?.length > 0) {
      setLeaveRequestList(response.data?.leaves);
      setTotal(response.data?.total);
    } else {
      setLeaveRequestList([]);
      setTotal(0);
      setPage(1);
    }
    setLoading(false);
  };

  //call fetch counts
  useEffect(() => {
    fetchLeaveCounts();
    // eslint-disable-next-line
  }, []);

  // fetch leave counts
  const fetchLeaveCounts = async () => {
    const response = await getLeaveRequestCount();
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
  const updateCards = (stats: LeaveStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case statusEnum.APPROVED:
            return { ...card, count: stats.approved };

          case statusEnum.REJECTED:
            return { ...card, count: stats.rejected };

          case statusEnum.PENDING:
            return { ...card, count: stats.pending };

          default:
            return card;
        }
      }),
    );
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(pathNames.ADD_LEAVE_REQUEST);
  };

  // handle status open close
  const handleStatusOpenClose = () => {
    setStatusOpen((prev) => !prev);
    setLeaveRequest(initialLeaveRequest);
  };

  // handle update status
  const handleUpdateStatus = (leave: ILeaveRequest) => {
    handleStatusOpenClose();
    setLeaveRequest(leave);
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

    const response = await updateLeaveRequestStatus(payload, leave._id);
    if (response.success) {
      fetchLeaveRequestList({ page, limit, search });
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

  // handle Download Excel
  const handleDownloadExcel = async (password: string) => {
    await getLeaveRequestList({
      page,
      limit,
      search,
      status: "",
      isDownload: true,
    });
  };

  return (
    <>
      <TopBar
        title="All Leave Requests"
        actionButtons={
          <Button
            name="Add Leave"
            size="sm"
            onClick={handleOnAdd}
            leftIcon={<i className="fa-solid fa-plus"></i>}
          />
        }
        isSearch
        searchPlaceholder="Search leave..."
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
        <LeaveRequestTable
          leaves={leaveList}
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
        title={`Are you sure you want to update leave status for this employee?`}
        showFullTitle={true}
        isOpen={statusOpen}
        status={leave.status}
        handleOpenClose={handleStatusOpenClose}
        handleSubmit={handleStatusSubmit}
        loading={statusLoading}
        options={cards
          .filter((ele) => ele.id !== "")
          .map((ele) => ({ label: ele.title, value: ele.id }))}
      />
    </>
  );
};

export default LeaveRequest;
