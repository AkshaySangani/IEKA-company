import React from "react";
import Image from "../../../../common/image";
import IekaLogo from "../../../../../assets/images/ieka_logo.jpg";

interface CompanyHeaderProps {
  company: any;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="border-b border-black pb-5 sm:pb-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        {/* Logo */}
        <div className="flex h-14 w-24 shrink-0 items-center sm:h-16 sm:w-28">
          <Image
            src={IekaLogo}
            alt={`${company.name} logo`}
            fallbackSrc={IekaLogo}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Company Information */}
        <div className="min-w-0">
          <h1 className="text-xl font-medium text-secondary sm:text-2xl">
            {company.name}
          </h1>

          <p className="mt-1 max-w-md text-wrap text-xs leading-5 text-grayText sm:text-sm sm:leading-5 line-clamp-2 truncate">
            {company.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
