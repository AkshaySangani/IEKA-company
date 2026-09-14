import AllEmployeePayslips from "../../../components/company/pay-slip/employee-payslips";
import { EmployeePayslipDetails } from "../../../components/company/pay-slip/employee-payslips/EmployeePayslipDetails";
import { useAuthStore } from "../../../store/auth-store";
import { RoleEnum } from "../../../types/common-types";


export default function PayslipPage(){
    const {user} = useAuthStore();
    const isManager = user.role === RoleEnum.MANAGER;
    return isManager ? <AllEmployeePayslips /> : <EmployeePayslipDetails id={user._id} />
}