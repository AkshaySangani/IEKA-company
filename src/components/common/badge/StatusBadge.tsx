import React from "react";
import { statusEnum } from "../../../types/common-types";

interface StatusBadgeProps {
  status: statusEnum;
  className?: string;
}

const STATUS_CONFIG: Record<
  statusEnum,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  [statusEnum.ACTIVE]: {
    label: "Active",
    className: "text-success",
    icon: <i className="fa-solid fa-circle-check"></i>,
  },

  [statusEnum.APPROVED]: {
    label: "Approved",
    className: "text-success",
    icon: <i className="fa-solid fa-circle-check"></i>,
  },

  [statusEnum.INACTIVE]: {
    label: "Inactive",
    className: "text-warning",
    icon: <i className="fa-solid fa-clock"></i>,
  },

  [statusEnum.PENDING]: {
    label: "Pending",
    className: "text-pending",
    icon: <i className="fa-solid fa-clock"></i>,
  },

  [statusEnum.ACCEPTED]: {
    label: "Accepted",
    className: "text-success",
    icon: <i className="fa-solid fa-circle-check"></i>,
  },

  [statusEnum.REJECTED]: {
    label: "Rejected",
    className: "text-danger",
    icon: <i className="fa-solid fa-circle-xmark"></i>,
  },

  [statusEnum.DELETED]: {
    label: "Deleted",
    className: "text-danger",
    icon: <i className="fa-solid fa-circle-xmark"></i>,
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full
        px-1 py-0.5 text-sm font-medium
        ${config.className}
        ${className}
      `}
    >
      {config.icon}

      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;