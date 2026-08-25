import Dashboard from "../../components/company/dashboard";
import EmployeeDashboard from "../../components/employee/dashboard";
import { useAuthStore } from "../../store/auth-store";
import { RoleEnum, ViewModeEnum } from "../../types/common-types";

const DashboardPage = () => {
  const { user, viewMode } = useAuthStore((state) => state);
  return (
    <>
      {
        {
          [RoleEnum.OWNER]: <Dashboard />,
          [RoleEnum.MANAGER]:
            viewMode === ViewModeEnum.MANAGER ? (
              <Dashboard />
            ) : (
              <EmployeeDashboard />
            ),
          [RoleEnum.EMPLOYEE]: <EmployeeDashboard />,
        }[user.role]
      }
    </>
  );
};

export default DashboardPage;
