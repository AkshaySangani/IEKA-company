import {
  ExpenseCategoryEnum,
  ExpenseCategoryOption,
} from "../../../../../types/common-types";
import CategorySelectorCard from "../../../../common/statecard/CategorySelectorCard";

interface CategoryCardsProps {
  active: string;
  setActive: (value: string) => void;
}
export default function CategoryCards({
  active,
  setActive,
}: CategoryCardsProps) {
  const expenseCategoryOptions: ExpenseCategoryOption[] = [
    {
      label: "Electronics Item",
      value: ExpenseCategoryEnum.ELECTRONICS_ITEM,
      icon: <i className="fa-solid fa-bolt"></i>,
      activeColor: "bg-warning",
      textColor: "text-warning",
    },
    {
      label: "Machinery & Tools",
      value: ExpenseCategoryEnum.MACHINERY_AND_TOOLS,
      icon: <i className="fa-solid fa-gears"></i>,
      activeColor: "bg-pending",
      textColor: "text-pending",
    },
    {
      label: "Bill & Subscriptions",
      value: ExpenseCategoryEnum.BILL_AND_SUBSCRIPTIONS,
      icon: <i className="fa-solid fa-receipt"></i>,
      activeColor: "bg-purple",
      textColor: "text-purple",
    },
    {
      label: "Vehicle",
      value: ExpenseCategoryEnum.VEHICLE,
      icon: <i className="fa-solid fa-truck-moving"></i>,
      activeColor: "bg-secondary",
      textColor: "text-secondary",
    },
    {
      label: "Medical Care",
      value: ExpenseCategoryEnum.MEDICAL_CARE,
      icon: <i className="fa-solid fa-briefcase-medical"></i>,
      activeColor: "bg-success",
      textColor: "text-success",
    },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {expenseCategoryOptions.map((ele, index) => (
        <CategorySelectorCard 
            key={index}
            title={ele.label} 
            icon={ele.icon}
            active={active === ele.value}
            activeColor={ele.activeColor}
            textColor={ele.textColor}
            onClick={() => setActive(ele.value)}
        />
      ))}
    </div>
  );
}
