
import globeBg from "../../../../assets/images/globe.png";
import { useNavigate } from "react-router-dom";
import MonthPicker, { MonthPickerValue } from "../../../common/date-picker/MonthPicker";
import { FilterCardItem } from "../../../../types/common-types";
import PageLoader from "../../../common/loader/PageLoader";
import { currency, employeePathNames } from "../../../../constants/constants";
import RightArrow from "../../../common/right-arrow";
import { getFloatValue } from "../../../../utils/helper";
import SummaryCard from "../../../common/statecard/SummaryCard";


interface ReimbursementCardProps {
  cards: FilterCardItem[];
  selected: MonthPickerValue;
  setSelected: (value: MonthPickerValue) => void;
  loading: boolean;
}

export default function ReimbursementCard({
  cards,
  selected,
  setSelected,
  loading,
}: ReimbursementCardProps) {
  const navigate = useNavigate();

  const total = cards.find((ele) => ele.id === "");

  const expenseCards = cards.filter(
    (ele) => ele.id !== "",
  );

  return (
    <div
      className="
        w-full
        bg-white
        bg-no-repeat
        p-3
        shadow-[rgba(50,50,93,0.25)_0px_1px_3px_-5px,rgba(0,0,0,0.3)_0px_7px_15px_-8px]
        sm:p-4
        relative
      "
      style={{
        backgroundImage: `url(${globeBg})`,
        backgroundSize: "contain",
        backgroundPosition: "95%",
      }}
    >
      <PageLoader loading={loading} />

      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-borderPrimary
          pb-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-2
        "
      >
        {/* Title */}
        <div className="flex items-center">
          <span className="text-lg font-medium text-secondary">
            {currency.INR}
          </span>

          <span className="mx-2 border-r border-borderPrimary pr-2 text-md font-medium text-secondary">
            Reimbursement
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(employeePathNames.REIMBURSEMENT)}
          />
        </div>

        {/* Date Filter */}
        {/* <div className="w-full sm:w-auto"> */}
        <MonthPicker value={selected} onChange={setSelected} />
        {/* </div> */}
      </div>

      <div className="flex flex-col justify-between">
        {/* Total Expense */}
        <div className="py-4 sm:py-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <div className="h-[45px] w-[45px] sm:h-[45px] sm:w-[45px] rounded-full bg-primaryBlue flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {currency.INR}
                </span>
              </div>

              <span className="text-2xl font-medium text-secondary sm:text-[26px]">
                {total?.amount && getFloatValue(total.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Items */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-5">
          {expenseCards.map((ele) => (
            <SummaryCard
              key={ele.title}
              title={ele.title}
              amount={`${currency.INR} ${
                ele.amount && getFloatValue(ele.amount)
              }`}
              trendDetails={null}
              bgColor={ele.activeColor}
              onClick={() => navigate(employeePathNames.REIMBURSEMENT)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
