import React from "react";
import { formatCurrency } from "../../../../../utils/helper";
import {
  IPayrollTotals,
  ISalaryItem,
} from "../../../../../types/employee/employee-payslip.types";

interface EarningsSectionProps {
  earnings: ISalaryItem[];
  totals: IPayrollTotals;
}

const EarningsSection: React.FC<EarningsSectionProps> = ({
  earnings,
  totals,
}) => {
  return (
    <section className="min-w-0">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-gray-300 pb-2">
        <h3 className="text-xs font-bold uppercase text-secondary sm:text-sm">
          Earnings
        </h3>

        <h3 className="text-right text-xs font-bold uppercase text-secondary sm:text-sm">
          Amount
        </h3>
      </div>

      {/* Earnings */}
      <div>
        {earnings.map((earning, index) => (
          <div
            key={`${earning.name}-${index}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 text-[11px] sm:text-xs"
          >
            <span className="min-w-0 break-words text-secondary">
              {earning.name}
            </span>

            <span className="whitespace-nowrap text-right text-secondary">
              {formatCurrency(earning.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-y border-gray-300 py-3">
        <span className="text-xs font-bold text-secondary sm:text-sm">
          Gross Earnings
        </span>

        <span className="whitespace-nowrap text-right text-xs font-bold text-secondary sm:text-sm">
          {formatCurrency(totals.salaryAmount)}
        </span>
      </div>
    </section>
  );
};

export default EarningsSection;
