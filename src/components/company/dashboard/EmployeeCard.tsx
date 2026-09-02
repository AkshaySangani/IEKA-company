import Image from "../../common/image";
import SnippetWomen from "../../../assets/images/snipetwomen.png";
import UserAvatar from "../../../assets/images/User-Image.png";

import { useEffect, useState } from "react";

import { getGreeting } from "../../../utils/helper";

import {
  getPunchInfo,
  punchIn,
  punchOut,
} from "../../../apis/performance/attendance.api";

import {
  AttendanceMethodEnum,
  AttendanceStatusEnum,
  RoleEnum,
} from "../../../types/common-types";
import { getDashboardProfile } from "../../../apis/dashboard/dashboard.api";
import { getLocationPayload } from "../../../utils/location";
import { DateFormat, formatDate } from "../../../utils/date-format";
import PageLoader from "../../common/loader/PageLoader";
import LocationPermissionModal from "../../common/modal/LocationPermissionModal";

interface IBranch {
  _id: string;
  name: string;
}

interface IShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface IDepartment {
  _id: string;
  name: string;
}

interface IDashboardUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;

  branchId: IBranch;
  shiftId: IShift;
  departmentId: IDepartment;

  designationId: {
    _id: string;
    name: string;
  };
}

interface IDashboardProfileResponse {
  branches: IBranch[];
  shifts: IShift[];
  departments: IDepartment[];
  user: IDashboardUser;
}

export interface IPunchInfo {
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
  leaveRequestId: string | null;
  autoClosed: boolean;
  isManualPunchIn: boolean;
  manualPunchInBy: string | null;
  isManualPunchOut: boolean;
  manualPunchOutBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const EmployeeCard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [employeeDetails, setEmployeeDetails] =
    useState<IDashboardProfileResponse | null>(null);

  const [punchInfo, setPunchInfo] = useState<IPunchInfo | null>(null);

  useEffect(() => {
    fetchDashboardData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

    // eslint-disable-next-line
  }, []);

  /**
   * Fetch Dashboard APIs
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [profileResponse, punchResponse] = await Promise.all([
        getDashboardProfile(),
        getPunchInfo(),
      ]);

      setEmployeeDetails(profileResponse?.data);
      setPunchInfo(punchResponse?.data);
    } catch (error) {
      console.error("Dashboard API Error", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Punch In
   */
  const setPunchIn = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = await getLocationPayload();

      if (payload.latitude && payload.longitude) {
        const response = await punchIn(payload);
        if (response.success) {
          await fetchDashboardData();
        }
      } else {
        setLocationOpen(true);
      }

      console.log("Punch In Payload", payload);
    } catch (error) {
      console.error("Punch In Error", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Punch Out
   */
  const setPunchOut = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = await getLocationPayload();

      if (payload.latitude && payload.longitude) {
        const response = await punchOut(payload);

        if (response.success) {
          await fetchDashboardData();
        }
      } else {
        setLocationOpen(true);
      }

      console.log("Punch Out Payload", payload);
    } catch (error) {
      console.error("Punch Out Error", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /**
   * User
   */
  const user = employeeDetails?.user;
  const isOwner = user ? user.role === RoleEnum.OWNER : false;

  /**
   * Punch status
   */
  const isPunchedIn =
    punchInfo?.inTime ?? Boolean(punchInfo?.inTime && !punchInfo?.outTime);

  /**
   * User branches
   */
  const branches = employeeDetails?.branches ?? [];

  /**
   * User departments
   */
  const departments = employeeDetails?.departments ?? [];

  return (
    <>
      <div className="w-full relative p-3 sm:p-4 content-card">
        <PageLoader loading={loading} />
        {/* Top Greeting */}
        <div className="relative flex min-h-[115px] overflow-hidden bg-primaryBlur sm:min-h-[130px]">
          {/* Greeting + Punch */}
          <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-4 py-4 sm:px-6">
            <div className="text-lg font-medium text-primaryLight sm:text-2xl">
              {getGreeting()} !
            </div>
            {!isOwner && (
              <>
                <div className="mt-2 text-xs text-primaryDark">
                  {isPunchedIn ? (
                    <>
                      Punched in at{" "}
                      <span className="font-medium">
                        {formatDate(punchInfo?.inTime, DateFormat.TIME_24) ||
                          "--"}
                      </span>
                    </>
                  ) : (
                    "Not punched in"
                  )}
                </div>

                {/* Punch Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={isPunchedIn ? setPunchOut : setPunchIn}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-sm border border-primaryLight bg-white px-3 text-sm font-medium text-primaryLight transition hover:bg-primaryLight hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <i className="fa-solid fa-user-clock text-sm" />

                  <span>{isPunchedIn ? "Punch Out" : "Punch In"}</span>

                  <span className="text-xs opacity-70">({formattedTime})</span>
                </button>
              </>
            )}
          </div>

          {/* Illustration */}
          <div className="absolute bottom-0 right-0 flex h-full items-end">
            <Image
              src={SnippetWomen}
              fallbackSrc={SnippetWomen}
              alt="Greeting"
              className="w-[145px] object-contain sm:w-[200px]"
            />
          </div>
        </div>

        {/* Employee Details */}
        <div className="px-1 py-4 sm:px-2 sm:py-5">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Profile Image */}
            <Image
              src={user?.profileImage ? user.profileImage : UserAvatar}
              fallbackSrc={UserAvatar}
              alt={user ? `${user.firstName} ${user.lastName}` : "Employee"}
              className="h-14 w-14 shrink-0 rounded-full border border-borderPrimary object-cover sm:h-[68px] sm:w-[68px]"
            />

            {/* Details */}
            <div className="min-w-0 flex-1">
              {/* Name + Designation */}
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h2 className="text-lg font-semibold text-secondary sm:text-xl">
                  {user ? `${user.firstName} ${user.lastName}` : "--"}
                </h2>

                <span className="text-sm text-grayText">
                  (
                  {user?.designationId
                    ? user?.designationId?.name
                    : user?.role === RoleEnum.OWNER
                      ? "COO"
                      : "--"}
                  )
                </span>
              </div>

              {/* Shift */}
              <div className="mt-1.5 text-sm text-grayText">
                <span className="font-medium text-secondary">
                  {user?.shiftId?.name || "--"}
                </span>

                {user?.shiftId && (
                  <span className="ml-1 text-grayText">
                    ({user.shiftId.startTime} to {user.shiftId.endTime})
                  </span>
                )}
              </div>

              {/* Branches */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {branches.map((branch) => (
                  <span
                    key={branch._id}
                    className="rounded bg-disabledBg px-2.5 py-1 text-xs text-grayText"
                  >
                    {branch.name}
                  </span>
                ))}
              </div>

              {/* Departments */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {departments.map((department) => (
                  <span
                    key={department._id}
                    className="rounded bg-pendingBlur px-2.5 py-1 text-xs text-primaryLight"
                  >
                    {department.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LocationPermissionModal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
      />
    </>
  );
};

export default EmployeeCard;
