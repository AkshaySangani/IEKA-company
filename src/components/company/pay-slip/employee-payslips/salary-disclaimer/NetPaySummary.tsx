import React from "react";
import { formatCurrency, numberToWords } from "../../../../../utils/helper";

interface NetPaySummaryProps {
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
}

const NetPaySummary: React.FC<NetPaySummaryProps> = ({
  grossEarnings,
  totalDeductions,
  netPay,
}) => {
  const amountInWords = numberToWords(netPay);

  return (
    <div className="mt-8 bg-pendingLight px-4 py-5 text-center sm:mt-10 sm:px-5 sm:py-6">
      <p className="text-xs leading-6 text-secondary sm:text-sm">
        Total Net Payable{" "}
        <span className="font-bold text-secondary">
          {formatCurrency(netPay)}
        </span>{" "}
        <span className="block sm:inline">({amountInWords} Only)</span>
      </p>

      <p className="mt-2 text-[9px] leading-4 text-gray-500 sm:text-[10px]">
        **Total Net Payable = Gross Earnings - Total Deductions
      </p>
    </div>
  );
};

export default NetPaySummary;
