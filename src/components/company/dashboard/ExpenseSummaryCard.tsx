import { currency, pathNames } from "../../../constants/constants";
import RightArrow from "../../common/right-arrow";
import SummaryCard from "../../common/statecard/SummaryCard";
import globeBg from "../../../assets/images/globe.png";
import { ExpenseCardItem } from "../../../types/common-types";
import { useNavigate } from "react-router-dom";
import DateRangePicker, {
  DateRangeValue,
} from "../../common/date-picker/DateRangePicker";
import PageLoader from "../../common/loader/PageLoader";
import { getFloatValue } from "../../../utils/helper";

interface ExpenseSummaryCardProps {
  cards: ExpenseCardItem[];
  selected: DateRangeValue;
  setSelected: (value: DateRangeValue) => void;
  loading: boolean;
}

export default function ExpenseSummaryCard({
  cards,
  selected,
  setSelected,
  loading,
}: ExpenseSummaryCardProps) {
  const navigate = useNavigate();
  const total = cards.find((ele) => ele.id === pathNames.OVERALL_EXPENSE);
  return (
    <div
      className="content-card p-[15px] relative bg-white bg-no-repeat bg-contain bg-[position:95%] shadow-[rgba(50,50,93,0.25)_0px_1px_3px_-5px,rgba(0,0,0,0.3)_0px_7px_15px_-8px]"
      style={{
        backgroundImage: `url(${globeBg})`,
      }}
    >
      <PageLoader loading={loading}/>
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center">
          <span className="text-[18px] font-medium">{currency.INR}</span>
          <span className="px-2 text-md font-medium border-r mr-2">
            Total Expense
          </span>
          <RightArrow
            label="View"
            onClick={() => navigate(total?.id ?? pathNames.OVERALL_EXPENSE)}
          />
        </div>
        <DateRangePicker
          startDate={selected.startDate}
          endDate={selected.endDate}
          onChange={function (dates: [Date | null, Date | null]): void {
            const [start, end] = dates;
            setSelected({
              startDate: start,
              endDate: end,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-3 py-3">
        <div className="flex items-start">
          <div className="h-[45px] w-[45px] rounded-full bg-primaryBlue flex items-center justify-center">
            <span className="text-[20px] font-medium leading-none text-white">
              {currency.INR}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="px-2 text-2xl font-medium">{total?.amount && getFloatValue(total?.amount)}</span>
            {total?.trendDetails && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[18px] font-bold ${
                    total?.trendDetails.type === "high"
                      ? "text-success"
                      : total?.trendDetails.type === "low"
                        ? "text-error"
                        : "text-secondary"
                  }`}
                >
                  {total?.trendDetails.type === "high"
                    ? "↑"
                    : total?.trendDetails.type === "low"
                      ? "↓"
                      : "→"}
                </span>

                <span
                  className={`text-[16px] font-medium ${
                    total?.trendDetails.type === "high"
                      ? "text-success"
                      : total?.trendDetails.type === "low"
                        ? "text-error"
                        : "text-secondary"
                  }`}
                >
                  {total?.trendDetails.type === "high" ? "+" : ""}
                  {total?.trendDetails.percentage}%
                </span>

                <span className="text-xs text-secondary">Last Month</span>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {cards
            .filter((ele) => ele.id !== pathNames.OVERALL_EXPENSE)
            .map((ele, index) => (
              <SummaryCard
                title={ele.title}
                amount={`${currency.INR} ${ele.amount && getFloatValue(ele.amount)}`}
                trendDetails={ele.trendDetails}
                bgColor={ele.activeColor}
                onClick={() => navigate(ele.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
