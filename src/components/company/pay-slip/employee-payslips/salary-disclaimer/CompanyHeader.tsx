import React from "react";
import Image from "../../../../common/image";
import IekaLogo from "../../../../../assets/images/ieka_logo.jpg";
import { ICompany } from "../../../../../types/employee/employee-payslip.types";

interface CompanyHeaderProps {
  company: ICompany;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="border-b border-black pb-5 sm:pb-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        {/* Logo */}
        <div className="flex h-14 w-24 shrink-0 items-center sm:h-16 sm:w-28">
          <Image
            src={company.companyLogo}
            alt={`${company.companyName} logo`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Company Information */}
        <div className="min-w-0">
          <h1 className="text-xl font-medium text-secondary sm:text-2xl">
            {company.companyName}
          </h1>

          <p className="mt-1 max-w-md text-wrap text-xs leading-5 text-grayText sm:text-sm sm:leading-5 line-clamp-2 truncate">
            {company.companyAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
