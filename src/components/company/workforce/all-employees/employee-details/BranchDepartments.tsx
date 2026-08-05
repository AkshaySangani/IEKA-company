import { IAssignment, IBaseEntity, IShift } from ".";
import { IBranch } from "../../onboarding/assign-roles-responsibility";

interface Props {
  cards: {
    branch: IBaseEntity;
    shift: IShift;
    departments: IBaseEntity[];
  }[];
}

const BranchDepartmentCards = ({ cards }: Props) => {
  return (
    <div className="flex flex-col items-end gap-3">
      {cards.map((ele, index) => (
        <div className="flex items-end gap-3" key={index}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary border-r border-secondary/30 pr-3">
                {ele?.branch?.name}
              </span>

              <p className="text-sm text-primaryBlue font-medium">
                {ele.shift?.name}
              </p>
            </div>

            <div className="mt-1 flex flex-wrap justify-end gap-2">
              {ele.departments?.map((department) => (
                <span
                  key={department.name}
                  className=" bg-pendingLight px-2 py-0.5 text-xs text-gray-600"
                >
                  {department.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BranchDepartmentCards;
