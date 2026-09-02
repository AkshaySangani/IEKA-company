import React from "react";
import {
  IDocuments,
  IPayslipUser,
  IUserDetails,
} from "../../../../../types/employee/employee-payslip.types";
import { documentEnum } from "../../../../../types/common-types";
interface EmployeeInfoProps {
  employee: IPayslipUser;
  userDetails: IUserDetails;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({
  employee,
  userDetails,
}) => {
  const panDetail: IDocuments | null = userDetails.documents
    ? (userDetails.documents.find((ele) => ele.card === documentEnum.pan) ??
      null)
    : null;
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
        {panDetail && panDetail.card && (
          <div className="flex min-w-0">
            <span className="w-28 shrink-0 text-grayText sm:w-32">PAN</span>

            <span className="break-all text-secondary">
              : {panDetail.cardNumber}
            </span>
          </div>
        )}

        {/* Bank Account */}
        {userDetails.bank.accountNo && (
          <div className="flex min-w-0">
            <span className="w-28 shrink-0 text-grayText sm:w-32">
              Bank Account No
            </span>

            <span className="break-all text-secondary">
              : {userDetails.bank.accountNo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfo;
