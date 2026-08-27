import LeaveRequest from "../../../../components/company/performance/leave-request";
import EmployeeLeaveRequest from "../../../../components/employee/leave";
import { useAuthStore } from "../../../../store/auth-store";
import { RoleEnum, ViewModeEnum } from "../../../../types/common-types";

export default function LeaveRequestsPage() {
  const { user, viewMode } = useAuthStore((state) => state);
  return (
    <>
      {
        {
          [RoleEnum.OWNER]: <LeaveRequest />,
          [RoleEnum.MANAGER]:
            viewMode === ViewModeEnum.MANAGER ? (
              <LeaveRequest />
            ) : (
              <EmployeeLeaveRequest />
            ),
          [RoleEnum.EMPLOYEE]: <EmployeeLeaveRequest />,
        }[user.role]
      }
    </>
  );
}
