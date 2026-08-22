import { useEffect, useState } from "react";
import Button from "../../../common/button/Button";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import Pagination from "../../../common/pagination/Pagination";
import {
  AttendanceMethodEnum,
  AttendanceStatusEnum,
  FilterCardItem,
  LeaveDuration
} from "../../../../types/common-types";
import { pathNames, statusMessage } from "../../../../constants/constants";
import AttendanceTable from "./AttendanceTable";
import { useNavigate } from "react-router-dom";
import {
  getAttendanceCount,
  getAttendanceList,
} from "../../../../apis/performance/attendance.api";
import StatusCards, { AttendanceStats } from "./StatusCards";
import TextField from "../../../common/text-field/TextField";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import { IUser } from "../../../../types/user.types";

export interface ILeaveRequest {
  _id: string;
  leaveId: {
    _id: string;
    name: string;
  };
  duration: LeaveDuration;
}

export interface IUserAttendance {
  _id: string;
  userId: IUser;
  inTime: string;
  outTime: string;
  inMethod: AttendanceMethodEnum;
  outMethod: AttendanceMethodEnum;
  totalWorkedMinutes: number;
  lateMinutes: number;
  isHalfDay: boolean;
  earlyExitMinutes: number;
  attendanceStatus: AttendanceStatusEnum;
  leaveRequestId: ILeaveRequest | null;
  isLate: boolean;
  inLocation?: ILocation;
  outLocation?: ILocation;
  attendanceDate?: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
}

const Attendance: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [activeCard, setActiveCard] = useState<string>("");
  const [date, setDate] = useState<string>(
    formatDate(new Date(), DateFormat.ISO_DATE),
  );
  // new Date().toISOString().split("T")[0],
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [attendanceList, setAttendanceList] = useState<IUserAttendance[]>([]);

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
      id: AttendanceStatusEnum.PRESENT,
      title: statusMessage[AttendanceStatusEnum.PRESENT],
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <i className="fa-solid fa-user-check"></i>,
    },
    {
      id: AttendanceStatusEnum.ABSENT,
      title: statusMessage[AttendanceStatusEnum.ABSENT],
      count: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: <i className="fa-solid fa-user-xmark"></i>,
    },
    {
      id: AttendanceStatusEnum.LEAVE,
      title: statusMessage[AttendanceStatusEnum.LEAVE],
      count: 0,
      activeColor: "bg-warning",
      textColor: "text-warning",
      icon: <i className="fa-solid fa-mug-hot"></i>,
    },
  ]);
  // useEffect for get branch
  useEffect(() => {
    fetchAttendanceList({
      page,
      limit,
      search,
      status: activeCard,
      date: date,
    });
  }, [page, limit, search, activeCard, date]);

  useEffect(() => {
    fetchAttendanceCount();
    // eslint-disable-next-line
  }, [date]);

  const fetchAttendanceCount = async () => {
    const response = await getAttendanceCount(date);
    if (response?.success) {
      updateCards(response?.data);
    }
  };

  // update cards
  const updateCards = (stats: AttendanceStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, count: stats.total };

          case AttendanceStatusEnum.ABSENT:
            return { ...card, count: stats.absent };

          case AttendanceStatusEnum.LEAVE:
            return { ...card, count: stats.leave };

          case AttendanceStatusEnum.PRESENT:
            return { ...card, count: stats.present };

          default:
            return card;
        }
      }),
    );
  };

  // get branch list
  const fetchAttendanceList = async (payload: {
    page: number;
    limit: number;
    search: string;
    date: string;
    status?: string;
  }) => {
    setLoading(true);
    const response = await getAttendanceList(payload);
    if (response.success && response.data?.attendance?.length > 0) {
      setAttendanceList(response.data?.attendance);
      setTotal(response.data?.total);
      setLoading(false);
    } else {
      setAttendanceList([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }
  };

  // handle click add new
  const handleOnAdd = () => {
    navigate(pathNames.ADD_DEPARTMENT);
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
    await getAttendanceList({
      page,
      limit,
      search,
      status: "",
      date,
      isDownload: true,
      password
    });
  };

  return (
    <>
      <TopBar
        title="All Attendances"
        actionButtons={
          <div className="flex gap-2">
            <TextField
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setPage(1);
              }}
            />
            <Button
              name="Add New"
              size="sm"
              onClick={handleOnAdd}
              leftIcon={<i className="fa-solid fa-plus"></i>}
            />
          </div>
        }
        isSearch
        searchPlaceholder="Search attendance..."
        onSearch={handleOnSearch}
        isExcel
        handleDownloadExcel={handleDownloadExcel}
      />
      <div className="content-area gap-2 flex flex-col">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
        <AttendanceTable attendance={attendanceList} />
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

export default Attendance;
