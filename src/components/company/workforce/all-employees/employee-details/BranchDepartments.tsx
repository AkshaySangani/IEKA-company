import { IBaseEntity, IShift } from ".";

interface Props {
  cards: {
    branch: IBaseEntity;
    shift: IShift;
    departments: IBaseEntity[];
  }[];
  className?: string;
  departmentClassName?: string;
}

const BranchDepartmentCards = ({ cards, className = "", departmentClassName = "" }: Props) => {
  return (
    <div className={`flex flex-col ${className} items-end gap-3 `}>
      {cards.map((ele, index) => (
        <div className="flex items-end gap-3" key={index}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary border-r border-secondary/30 pr-3">
                {ele?.branch?.name}
              </span>

              <p className="text-sm text-primaryLight font-medium">
                {ele.shift?.name}
              </p>
            </div>

            <div className={`mt-1 flex flex-wrap ${departmentClassName} justify-end gap-2`}>
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
