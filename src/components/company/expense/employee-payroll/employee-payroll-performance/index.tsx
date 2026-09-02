// EmployeeAttendancePage.tsx

import { useEffect, useState } from "react";
import MonthPicker, {
  MonthPickerValue,
} from "../../../../common/date-picker/MonthPicker";
import Button from "../../../../common/button/Button";
import PersonInfo from "../../../../common/person-info";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMyAttendanceCount,
  getUserAttendanceByUserId,
} from "../../../../../apis/performance/attendance.api";
import {
  AttendanceMethodEnum,
  AttendanceStatusEnum,
  FilterCardItem,
  LeaveDuration,
  RoleEnum,
  statusEnum,
} from "../../../../../types/common-types";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import PageLoader from "../../../../common/loader/PageLoader";
import { getEmployeeDetails } from "../../../../../apis/workforce/onboardings.api";
import { IUser } from "..";
import {
  pathNames,
  roleNames,
  statusMessage,
} from "../../../../../constants/constants";
import StatusCards, { AttendanceStats } from "./StatusCards";

export interface ILeaveRequest {
  _id: string;
  leaveId: {
    _id: string;
    name: string;
  };
  duration: LeaveDuration;
}

export interface ILocation  {
    latitude: number;
    longitude: number;
    address: string;
}
export interface IUserAttendance {
  _id: string;
  userId: IUser;
  companyId: string;
  attendanceDate: string;

  inTime: string | null;
  outTime: string | null;

  inMethod: AttendanceMethodEnum | null;
  outMethod: AttendanceMethodEnum | null;

  totalWorkedMinutes: number;
  overtimeMinutes: number;
  overtimeApproved: boolean;

  lateMinutes: number;
  isLate: boolean;
  isHalfDay: boolean;
  earlyExitMinutes: number;

  attendanceStatus: AttendanceStatusEnum;

  leaveRequestId: ILeaveRequest | null;

  autoClosed: boolean;

  inLocation : ILocation | null;
  outLocation : ILocation | null;
}

const EmployeePayrollPerformance = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId: string = params.id ?? "";

  const [loading, setLoading] = useState<boolean>(true);

  // employee attendance details state
  const [attendanceDetails, setAttendanceDetails] = useState<IUserAttendance[]>(
    [],
  );

  const [activeCard, setActiveCard] = useState<string>("");

  const [cards, setCards] = useState<FilterCardItem[]>([
    {
      id: "",
      title: "Total",
      count: 0,
      activeColor: "bg-info",
      textColor: "text-info",
      icon: <></>,
    },
    {
      id: AttendanceStatusEnum.PRESENT,
      title: statusMessage[AttendanceStatusEnum.PRESENT],
      count: 0,
      activeColor: "bg-success",
      textColor: "text-success",
      icon: <></>,
    },
    {
      id: AttendanceStatusEnum.ABSENT,
      title: statusMessage[AttendanceStatusEnum.ABSENT],
      count: 0,
      activeColor: "bg-danger",
      textColor: "text-danger",
      icon: <></>,
    },
    {
      id: AttendanceStatusEnum.LEAVE,
      title: statusMessage[AttendanceStatusEnum.LEAVE],
      count: 0,
      activeColor: "bg-warning",
      textColor: "text-warning",
      icon: <></>,
    },
    {
      id: AttendanceStatusEnum.HOLIDAY,
      title: statusMessage[AttendanceStatusEnum.HOLIDAY],
      count: 0,
      activeColor: "bg-pending",
      textColor: "text-pending",
      icon: <></>,
    },
    {
      id: AttendanceStatusEnum.WEEK_OFF,
      title: statusMessage[AttendanceStatusEnum.WEEK_OFF],
      count: 0,
      activeColor: "bg-info",
      textColor: "text-info",
      icon: <></>,
    },
  ]);

  // employee details state
  const initialState: IUser = {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    status: statusEnum.ACTIVE,
    role: RoleEnum.EMPLOYEE,
  };
  const [employee, setEmployee] = useState<IUser>(initialState);

  const [selectedMonth, setSelectedMonth] = useState<MonthPickerValue>({
    month: 8,
    year: 2026,
  });

  useEffect(() => {
    if (userId) {
      fetchUserAttendance();
    }
    // eslint-disable-next-line
  }, [userId, selectedMonth.month]);

  useEffect(() => {
    if (userId) {
      fetchEmployeeDetails();
    }
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserAttendance = async () => {
    setLoading(true);
    try {
      const [response, countResponse] = await Promise.all([
        getUserAttendanceByUserId(
          selectedMonth.month,
          selectedMonth.year,
          userId,
        ),
        getMyAttendanceCount(selectedMonth.month, selectedMonth.year, userId),
      ]);

      // set attendance list
      if (response.success) {
        setAttendanceDetails(response?.data?.list);
      } else {
        setAttendanceDetails([]);
      }

      // set attendance count
      if (countResponse.success) {
        updateCards(countResponse.data);
      }
    } catch (err) {
      console.log("error->", err);
    } finally {
      setLoading(false);
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

          case AttendanceStatusEnum.HOLIDAY:
            return { ...card, count: stats.holiday };

          case AttendanceStatusEnum.WEEK_OFF:
            return { ...card, count: stats.weekOff };

          default:
            return card;
        }
      }),
    );
  };

  const fetchEmployeeDetails = async () => {
    const response = await getEmployeeDetails(userId);
    if (response?.success) {
      setEmployee(response?.data?.user);
    } else {
      setEmployee(initialState);
    }
  };

  const fetchAttendanceDetails = async (value: string) => {
    setLoading(true);
    const response = await getUserAttendanceByUserId(
      selectedMonth.month,
      selectedMonth.year,
      userId,
      value,
    );

    // set attendance list
    if (response.success) {
      setAttendanceDetails(response?.data?.list);
    } else {
      setAttendanceDetails([]);
    }
    setLoading(false);
  };

  // handle select filter card
  const handleSelectFilterCard = (value: string) => {
    setActiveCard(value);
    fetchAttendanceDetails(value);
  };
  return (
    <>
      {/* Month Picker */}
      <div className="flex justify-between items-center border-b border-slate-200 bg-white px-4 py-1.5">
        <div className="flex gap-3">
          <PersonInfo
            personInfo={{
              profileImage: employee.profileImage,
              firstName: employee.firstName,
              lastName: employee.lastName,
              description: roleNames[employee.role],
            }}
            className="border-r pr-3 border-inputBorder"
            imageClassName="rounded-0 w-[50px] h-[50px]"
            personClassName="text-black !text-md !font-[500]"
          />
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium">Month</span>
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          <Button
            size="sm"
            variant={"danger"}
            onClick={() => navigate(pathNames.EMPLOYEE_PAYROLL)}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        </div>
      </div>

      <div className="content-area flex flex-col gap-2">
        <PageLoader loading={loading} />
        <StatusCards
          cards={cards}
          activeCard={activeCard}
          setActiveCard={handleSelectFilterCard}
        />
        {/* Attendance Table */}
        <EmployeePerformanceTable attendance={attendanceDetails} />
      </div>
    </>
  );
};

export default EmployeePayrollPerformance;
