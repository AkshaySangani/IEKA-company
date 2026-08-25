import Reimbursement from "../../../../components/company/expense/reimbursement-claims";
import EmployeeReimbursement from "../../../../components/employee/reimbursement";
import { useAuthStore } from "../../../../store/auth-store";
import { RoleEnum, ViewModeEnum } from "../../../../types/common-types";

export default function ReimbursementPage() {
  const { user, viewMode } = useAuthStore((state) => state);
  return (
    <>
      {
        {
          [RoleEnum.OWNER]: <Reimbursement />,
          [RoleEnum.MANAGER]:
            viewMode === ViewModeEnum.MANAGER ? (
              <Reimbursement />
            ) : (
              <EmployeeReimbursement />
            ),
          [RoleEnum.EMPLOYEE]: <EmployeeReimbursement />,
        }[user.role]
      }
    </>
  );
}
