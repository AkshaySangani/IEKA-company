import React from "react";
import Image from "../../../common/image";
import UserImage from "../../../../assets/images/User-Image.png";
import { IPayslipBranch, IPayslipDepartment, IPayslipUser } from "../../../../types/employee/employee-payslip.types";
import { currency, roleNames } from "../../../../constants/constants";
import { getFloatValue } from "../../../../utils/helper";

interface EmployeeCardProps {
  user: IPayslipUser;
  branches: IPayslipBranch[];
  departments: IPayslipDepartment[];
  currentSalary: number;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({user, branches, departments, currentSalary}) => {
  return (
    <div className="content-card px-6 py-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Profile Image */}
        <div className="flex justify-center sm:justify-start">
          <Image
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            fallbackSrc={UserImage}
            className="h-[140px] w-[140px] rounded-[24px] object-cover"
          />
        </div>

        {/* Employee Details */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="text-[18px] font-medium leading-6 text-gray-800">
            {`${user.firstName} ${user.lastName}`}
          </h2>

          {/* ID + Role */}
          <div className="mt-1 flex items-center gap-2 text-[13px]">

            <span className="text-gray-600">{roleNames[user.role]}</span>
          </div>

          {/* Shift */}
          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
            <span>{user.shiftId?.name}{" ("}{user.shiftId?.startTime}{" to "}{user.shiftId?.endTime}{")"}</span>
          </div>

          {/* Branch */}
          <div className="mt-3 flex items-start text-[13px]">
            <span className="w-[110px] shrink-0 font-medium text-primary">
              Branch :
            </span>

            {/* Branches */}
            <div className="flex flex-wrap gap-1.5">
              {branches.map((branch) => (
                <span
                  key={branch._id}
                  className="rounded bg-disabledBg px-2.5 py-1 text-xs text-grayText"
                >
                  {branch.name}
                </span>
              ))}
            </div>
          </div>

          {/* Department */}
          <div className="mt-2 flex items-start text-[13px]">
            <span className="w-[110px] shrink-0 font-medium text-primary">
              Department :
            </span>

            {/* Departments */}
            <div className="flex flex-wrap gap-1.5">
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

          {/* Salary */}
          <div className="mt-2 flex items-center text-[13px]">
            <span className="w-[110px] shrink-0 font-medium text-primary">
              Salary :
            </span>

            <span className="text-[14px] font-medium text-gray-800">
              {currency.INR} {getFloatValue(currentSalary)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;