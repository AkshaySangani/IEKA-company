import Attendance from "../../../../components/company/performance/attendance";
import EmployeeAttendanceDetails from "../../../../components/company/performance/attendance/attendance-details";
import { useAuthStore } from "../../../../store/auth-store";
import { RoleEnum, ViewModeEnum } from "../../../../types/common-types";

export default function AttendancesPage() {
  const { user, viewMode } = useAuthStore((state) => state);
  return (
    <>
      {
        {
          [RoleEnum.OWNER]: <Attendance />,
          [RoleEnum.MANAGER]:
            viewMode === ViewModeEnum.MANAGER ? (
              <Attendance />
            ) : (
              <EmployeeAttendanceDetails id={user._id} />
            ),
          [RoleEnum.EMPLOYEE]: <EmployeeAttendanceDetails id={user._id} />,
        }[user.role]
      }
    </>
  );
}
