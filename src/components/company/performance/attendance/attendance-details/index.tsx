// EmployeeAttendancePage.tsx

import { useEffect, useState } from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import MonthPicker from "../../../../common/date-picker/MonthPicker";
import Button from "../../../../common/button/Button";
import PersonInfo from "../../../../common/person-info";
import Tabs, { TabOption } from "../../../../common/tabs/Tabs";
import { useNavigate, useParams } from "react-router-dom";
import { getUserAttendanceByUserId } from "../../../../../apis/performance/attendance.api";
import {
  AttendanceMethodEnum,
  AttendanceStatusEnum,
  AttendanceViewEnum,
  LeaveDuration,
  RoleEnum,
  statusEnum,
} from "../../../../../types/common-types";
import EmployeeAttendanceTable from "./EmploeeAttendanceTable";
import PageLoader from "../../../../common/loader/PageLoader";
import { getEmployeeDetails } from "../../../../../apis/workforce/onboardings.api";
import { IUser } from "..";
import { pathNames, roleNames } from "../../../../../constants/constants";

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
  userId: string;
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
}

const EmployeeAttendanceDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId: string = params.id ?? "";

  const [loading, setLoading] = useState<boolean>(true);

  // define tab option Calendar view and Table View
  const options: TabOption[] = [
    {
      label: AttendanceViewEnum.CALENDER_VIEW,
      icon: <i className="fa-regular fa-calendar-check"></i>,
      activeColor: "bg-primaryPurple",
      bgColor: "bg-white",
    },
    {
      label: AttendanceViewEnum.TABLE_VIEW,
      icon: <i className="fa-solid fa-table-cells-large"></i>,
      activeColor: "bg-primaryPurple",
      bgColor: "bg-white",
    },
  ];

  // active tab state
  const [active, setActive] = useState<AttendanceViewEnum>(
    AttendanceViewEnum.CALENDER_VIEW,
  );

  // employee attendance details state
  const [attendanceDetails, setAttendanceDetails] = useState<IUserAttendance[]>(
    [],
  );

  // employee details state
  const initialState: IUser = {
    _id: "",
    firstName: "",
    lastName: "",
    profileImage: "",
    status: statusEnum.ACTIVE,
    role: RoleEnum.EMPLOYEE
  }; 
  const [employee, setEmployee] = useState<IUser>(initialState);

  const [selectedMonth, setSelectedMonth] = useState({
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
    if(userId){
      fetchEmployeeDetails();
    }
    // eslint-disable-next-line
  }, [userId])

  const fetchUserAttendance = async () => {
    setLoading(true);
    try {
      const response = await getUserAttendanceByUserId(
        selectedMonth.month,
        selectedMonth.year,
        userId,
      );
      setAttendanceDetails(response?.data?.list);
    } catch (err) {
      console.log("error->", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    const response = await getEmployeeDetails(userId);
    if(response?.success){
      setEmployee(response?.data?.user)
    } else {
      setEmployee(initialState);
    }
  }

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
          <Tabs active={active} options={options} onChange={setActive} />
        </div>
        <div className="flex gap-3">
          <Button
            name="Overview"
            size="sm"
            onClick={() => {}}
            leftIcon={<i className="fa-solid fa-list-check"></i>}
          />
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
          <Button
            size="sm"
            variant={"danger"}
            onClick={() => navigate(pathNames.ATTENDANCE)}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        </div>
      </div>

      <div className="content-area">
        <PageLoader loading={loading} />

        {/* Calendar */}
        {
          {
            [AttendanceViewEnum.CALENDER_VIEW]: (
              <AttendanceCalendar
                selectedMonth={selectedMonth}
                attendanceData={attendanceDetails}
                onDateClick={(date) => {
                  console.log("Selected date:", date);
                }}
              />
            ),
            [AttendanceViewEnum.TABLE_VIEW]: (
              <EmployeeAttendanceTable attendance={attendanceDetails} />
            ),
          }[active]
        }
      </div>
    </>
  );
};

export default EmployeeAttendanceDetails;
