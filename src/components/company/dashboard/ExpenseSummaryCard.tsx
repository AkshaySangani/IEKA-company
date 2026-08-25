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

  const expenseCards = cards.filter(
    (ele) => ele.id !== pathNames.OVERALL_EXPENSE,
  );

  const trendColor =
    total?.trendDetails?.type === "high"
      ? "text-success"
      : total?.trendDetails?.type === "low"
        ? "text-danger"
        : "text-secondary";

  const trendIcon =
    total?.trendDetails?.type === "high"
      ? "↑"
      : total?.trendDetails?.type === "low"
        ? "↓"
        : "→";

  return (
    <div
      className="
        w-full
        bg-white
        bg-no-repeat
        p-3
        shadow-[rgba(50,50,93,0.25)_0px_1px_3px_-5px,rgba(0,0,0,0.3)_0px_7px_15px_-8px]
        sm:p-4
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
            Total Expense
          </span>

          <RightArrow
            label="View"
            onClick={() => navigate(total?.id ?? pathNames.OVERALL_EXPENSE)}
          />
        </div>

        {/* Date Filter */}
        {/* <div className="w-full sm:w-auto"> */}
        <DateRangePicker
          startDate={selected.startDate}
          endDate={selected.endDate}
          onChange={(dates: [Date | null, Date | null]) => {
            const [start, end] = dates;

            setSelected({
              startDate: start,
              endDate: end,
            });
          }}
          maxDate={new Date()}
        />
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

            {/* Trend */}
            {total?.trendDetails && (
              <div className=" flex items-center gap-2 pl-12">
                <span className={`text-lg font-bold ${trendColor}`}>
                  {trendIcon}
                </span>

                <span className={`text-sm font-medium ${trendColor}`}>
                  {total.trendDetails.type === "high" ? "+" : ""}
                  {total.trendDetails.percentage}%
                </span>

                <span className="text-xs text-grayText">Last Month</span>
              </div>
            )}
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
