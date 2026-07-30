import { currency, pathNames } from "../../../constants/constants";
import RightArrow from "../../common/right-arrow";
import { useNavigate } from "react-router-dom";
import { FilterCardItem } from "../../../types/common-types";
import StatCard from "../../common/statecard/StatCard";
import EmployeeActivityCard from "../../common/statecard/EmployeeActivityCard";
import { IDashboardEmployeeOverview } from ".";

interface WorkforceSummaryCardProps {
  cards: FilterCardItem[];
  workforce: IDashboardEmployeeOverview;
}

export default function WorkforceSummaryCard({
  cards,
  workforce,
}: WorkforceSummaryCardProps) {
  const navigate = useNavigate();
  const total = cards.find((ele) => ele.id === pathNames.OVERALL_EXPENSE);
  return (
    <div className="content-card p-[15px]">
      <div className="flex items-center pb-3 border-b">
        <i className="fa-solid fa-users"></i>
        <span className="px-2 text-md font-semibold border-r mr-2">
          Workforce
        </span>
        <RightArrow
          label="View"
          onClick={() => navigate(pathNames.ALL_EMPLOYEES)}
        />
      </div>
      <div className="flex flex-col gap-3 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StatCard
              key={card.id}
              count={card.count}
              title={card.title}
              icon={card.icon}
              active={false}
              textColor={card.textColor}
              activeColor={card.activeColor}
              className={"min-w-[100px]"}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EmployeeActivityCard
            title="Onboarding"
            icon={<i className="fa-solid fa-person-walking" />}
            count={workforce.onboarding.count}
            users={workforce.onboarding.list}
            onClick={() => navigate(pathNames.ONBOARDING)}
          />
          <EmployeeActivityCard
            title="Resigned"
            icon={<i className="fa-solid fa-user-gear"></i>}
            count={workforce.resignation.count}
            users={workforce.resignation.list}
            onClick={() => navigate(pathNames.RESIGNED)}
          />

          <EmployeeActivityCard
            title="Termination"
            icon={<i className="fa-solid fa-user-slash"></i>}
            count={workforce.termination.count}
            users={workforce.termination.list}
            onClick={() => navigate(pathNames.TERMINATION)}
          />

          <EmployeeActivityCard
            title="Promotion"
            icon={<i className="fa-solid fa-user-pen"></i>}
            count={workforce.promotion.count}
            users={workforce.promotion.list}
            onClick={() => navigate(pathNames.PROMOTION)}
          />
        </div>
      </div>
    </div>
  );
}
