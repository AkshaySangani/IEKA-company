import { useEffect, useState } from "react";
import {
  AttendanceStatusEnum,
  FilterCardItem,
  statusEnum,
} from "../../../../types/common-types";
import useDevice from "../../../../hooks/useDevice";
import { getDashboardLeaves } from "../../../../apis/dashboard/dashboard.api";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import EmployeeCard from "../EmployeeCard";
import { ReimbursementStats } from "../../expense/reimbursement-claims/StatusCards";
import { getReimbursementCount } from "../../../../apis/expense/reimbursement.api";
import { MonthPickerValue } from "../../../common/date-picker/MonthPicker";
import ReimbursementCard from "./ReimbursementCards";
import AttendanceCard, { IAttendanceCard } from "./AttendanceCard";
import { getUserAttendanceByUserId } from "../../../../apis/performance/attendance.api";
import { useAuthStore } from "../../../../store/auth-store";
import LeaveAndManualCard, {
  ILeaveItem,
  IManualPunchItem,
} from "./LeaveAndManualCard";

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  // page loading
  const { isMobile } = useDevice();
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);
  const [reimbursementLoading, setReimbursementLoading] =
    useState<boolean>(false);

  // month for expense data
  const initialMonth: MonthPickerValue = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const [selected, setSelected] = useState<MonthPickerValue>(initialMonth);

  const [attendanceMonth, setAttendanceMonth] =
    useState<MonthPickerValue>(initialMonth);

  const [leaveMonth, setLeaveMonth] = useState<MonthPickerValue>(initialMonth);

  const [leaveData, setLeaveData] = useState<ILeaveItem[]>([]);
  const [manualPunchData, setManualPunchData] = useState<IManualPunchItem[]>(
    [],
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [leaveLoading, setLeaveLoading] = useState<boolean>(false);

  const [cards, setCards] = useState<FilterCardItem[]>([
    {
      id: "",
      title: "Total",
      count: 0,
      amount: 0,
      activeColor: "#fff0f0",
      textColor: "bg-info",
      icon: <i className="fa-solid fa-users"></i>,
    },
    {
      id: statusEnum.PENDING,
      title: "Pending",
      count: 0,
      amount: 0,
      activeColor: "#fff0f0",
      textColor: "bg-pending",
      icon: <i className="fa-solid fa-mug-hot"></i>,
    },
    {
      id: statusEnum.APPROVED,
      title: "Approved",
      count: 0,
      amount: 0,
      activeColor: "#ecffeb",
      textColor: "bg-success",
      icon: <i className="fa-solid fa-user-plus"></i>,
    },
    {
      id: statusEnum.REJECTED,
      title: "Rejected",
      count: 0,
      amount: 0,
      activeColor: "#ffe9e5",
      textColor: "bg-danger",
      icon: <i className="fa-solid fa-user-minus"></i>,
    },
  ]);

  const [attendance, setAttendance] = useState<IAttendanceCard[]>([]);

  useEffect(() => {
    fetchEmployeeDashboardData();
    // eslint-disable-next-line
  }, []);

  // fetch all dashboard data
  const fetchEmployeeDashboardData = async () => {
    setLoading(true);

    try {
      const [
        attendanceResponse,
        reimbursementResponse,
        leaveAndManualResponse,
      ] = await Promise.all([
        getUserAttendanceByUserId(
          attendanceMonth.month,
          attendanceMonth.year,
          user._id,
        ),
        getReimbursementCount(selected),
        getDashboardLeaves(leaveMonth.month, leaveMonth.year),
      ]);

      // workforce
      if (attendanceResponse?.success) {
        setAttendance(attendanceResponse.data.list);
      }

      // reimbursement
      if (reimbursementResponse?.success) {
        updateCards(reimbursementResponse.data);
      }

      if (leaveAndManualResponse.success) {
        handleLeaveAndManualResponse(leaveAndManualResponse.data);
      } else {
        setLeaveData([]);
        setManualPunchData([]);
      }
    } catch (error) {
      console.error("EmployeeDashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch reimbursement data by month
  const fetchReimbursementData = async (selected: MonthPickerValue) => {
    setReimbursementLoading(true);
    const response = await getReimbursementCount(selected);

    if (response?.success) {
      updateCards(response.data);
    }

    setReimbursementLoading(false);
  };

  // fetch attendance data by month
  const fetchAttendanceData = async (value: MonthPickerValue) => {
    setAttendanceLoading(true);
    const response = await getUserAttendanceByUserId(
      value.month,
      value.year,
      user._id,
    );

    if (response?.success) {
      setAttendance(response.data.list);
    } else {
      setAttendance([]);
    }
    setAttendanceLoading(false);
  };

  // fetch leave and manual data by month
  const fetchLeaveAndManualData = async (value: MonthPickerValue) => {
    setLeaveLoading(true);
    const response = await getDashboardLeaves(value.month, value.year);

    if (response?.success) {
      handleLeaveAndManualResponse(response.data);
    } else {
      setLeaveData([]);
      setManualPunchData([]);
    }
    setLeaveLoading(false);
  };

  const updateCards = (stats: ReimbursementStats) => {
    setCards((prev) =>
      prev.map((card) => {
        switch (card.id) {
          case "":
            return { ...card, amount: stats.total };

          case statusEnum.PENDING:
            return {
              ...card,
              amount: stats.pending,
            };

          case statusEnum.APPROVED:
            return {
              ...card,
              amount: stats.approved,
            };

          case statusEnum.REJECTED:
            return {
              ...card,
              amount: stats.rejected,
            };

          default:
            return card;
        }
      }),
    );
  };

  // handle select month for reimbursement
  const handleSelectMonth = (value: MonthPickerValue) => {
    setSelected(value);
    fetchReimbursementData(value);
  };

  // handle change month for attendance
  const handleSelectAttendanceMonth = (value: MonthPickerValue) => {
    setAttendanceMonth(value);
    fetchAttendanceData(value);
  };

  // handle change month for leave and manual
  const handleSelectLeaveMonth = (value: MonthPickerValue) => {
    setLeaveMonth(value);
    fetchLeaveAndManualData(value);
  };

  //  handle leave and manual response
  const handleLeaveAndManualResponse = (data: any) => {
    // -------------------------
    // Manual Punch
    // -------------------------
    const formattedManualPunch: IManualPunchItem[] =
      data.manualPunch?.map((item: any) => {
        let punchType: "In" | "Out" | "Both" = "In";

        if (item.isManualPunchIn && item.isManualPunchOut) {
          punchType = "Both";
        } else if (item.isManualPunchIn) {
          punchType = "In";
        } else if (item.isManualPunchOut) {
          punchType = "Out";
        }

        return {
          date: String(new Date(item.attendanceDate).getDate()).padStart(
            2,
            "0",
          ),

          punchType,
        };
      }) || [];

    setLeaveData(data.leaves);
    setManualPunchData(formattedManualPunch);
  };

  return (
    <>
      {!isMobile && <TopBar title="Dashboard" />}
      <div className="content-area bg-dashboardBg flex flex-col gap-3">
        <PageLoader loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
          <EmployeeCard />
          <ReimbursementCard
            cards={cards}
            selected={selected}
            setSelected={handleSelectMonth}
            loading={reimbursementLoading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AttendanceCard
            attendance={attendance.filter(
              (ele) => ele.attendanceStatus !== AttendanceStatusEnum.WEEK_OFF,
            )}
            loading={attendanceLoading}
            month={attendanceMonth}
            handleSelectMonth={handleSelectAttendanceMonth}
          />
          <LeaveAndManualCard
            leaves={leaveData}
            manualPunch={manualPunchData}
            month={leaveMonth}
            handleSelectMonth={handleSelectLeaveMonth}
            loading={leaveLoading}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
