import React from "react";
import { IPayslipUser } from "../../../../../types/employee/employee-payslip.types";
interface EmployeeInfoProps {
  employee: IPayslipUser;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employee }) => {
  return (
    <div className="mt-5 border-b border-dotted border-gray-300 pb-5 sm:mt-6 sm:pb-6">
      {/* Employee Name */}
      <div>
        <p className="break-words text-sm text-secondary sm:text-base">
          <span className="font-bold">{`${employee.firstName} ${employee.lastName}`}</span>
        </p>

        <p className="mt-1 text-[11px] text-grayText sm:text-xs">
          {employee.designationId?.name} 
          {/* | Date of Joining:{" "} */}
          {/* {employee.joiningDate} */}
        </p>
      </div>

      {/* Employee Details */}
      <div className="mt-5 grid grid-cols-1 gap-2 text-xs sm:mt-7 sm:gap-y-1 sm:text-sm">
        {/* PAN */}
        <div className="flex min-w-0">
          <span className="w-28 shrink-0 text-grayText sm:w-32">PAN</span>

          <span className="break-all text-secondary">
            {/* : {employee.pan} */}
          </span>
        </div>

        {/* Bank Account */}
        <div className="flex min-w-0">
          <span className="w-28 shrink-0 text-grayText sm:w-32">
            Bank Account No
          </span>

          <span className="break-all text-secondary">
            {/* : {employee.bankAccount} */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
