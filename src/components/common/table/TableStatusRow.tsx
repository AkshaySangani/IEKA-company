type TableStatusVariant =
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "default";

interface TableStatusRowProps {
  title: string;
  variant?: TableStatusVariant;
}

const variantClasses: Record<TableStatusVariant, string> = {
  warning: "bg-yellowBlur text-warning",
  success: "bg-successLight text-success",
  danger: "bg-dangerLight text-danger",
  info: "bg-pendingLight text-pending",
  default: "bg-primaryLight text-primary",
};

const TableStatusRow = ({
  title,
  variant = "default",
}: TableStatusRowProps) => {
  return (
    <div
      className={`px-3 py-1 text-md font-semibold ${variantClasses[variant]}`}
    >
      {title}
    </div>
  );
};

export default TableStatusRow;