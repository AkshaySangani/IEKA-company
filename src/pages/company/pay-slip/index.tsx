import { EmployeePayslipDetails } from "../../../components/company/pay-slip/employee-payslips/EmployeePayslipDetails";
import { useAuthStore } from "../../../store/auth-store";


export default function PayslipPage(){
    const {user} = useAuthStore();
    return <EmployeePayslipDetails id={user._id} />
}