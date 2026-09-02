import React from "react";
import { AttendanceStatusEnum } from "../../../types/common-types";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatusEnum;
  size?: number;
  className?: string;
}

const statusConfig:
  | any
  | Record<
      Extract<
        AttendanceStatusEnum,
        | AttendanceStatusEnum.PRESENT
        | AttendanceStatusEnum.ABSENT
        | AttendanceStatusEnum.LEAVE
      >,
      {
        label: string;
        border: string;
        text: string;
        bg: string;
      }
    > = {
  [AttendanceStatusEnum.PRESENT]: {
    label: "P",
    border: "border-success",
    text: "text-success",
    bg: "bg-white",
  },
  [AttendanceStatusEnum.ABSENT]: {
    label: "A",
    border: "border-danger",
    text: "text-danger",
    bg: "bg-white",
  },
  //   [AttendanceStatusEnum.HALF_DAY]: {
  //     label: "HD",
  //     border: "border-orange-500",
  //     text: "text-orange-600",
  //     bg: "bg-white",
  //   },
  [AttendanceStatusEnum.LEAVE]: {
    label: "L",
    border: "border-warning",
    text: "text-warning text-md",
    bg: "bg-white",
  },
  [AttendanceStatusEnum.HOLIDAY]: {
    label: "H",
    border: "border-primaryPurple",
    text: "text-primaryPurple",
    bg: "bg-white",
  },
  [AttendanceStatusEnum.WEEK_OFF]: {
    label: "W",
    border: "border-secondary",
    text: "text-secondary",
    bg: "bg-white",
  },
  [AttendanceStatusEnum.REJECTED]: {
    label: "A",
    border: "border-danger",
    text: "text-danger",
    bg: "bg-white",
  },
};

const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({
  status,
  size = 28,
  className = "",
}) => {
  const config = statusConfig[status];

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full
        border
        font-medium
        ${config.border}
        ${config.text}
        ${config.bg}
        ${className}
      `}
      style={{
        width: size,
        height: size,
      }}
    >
      {config.label}
    </div>
  );
};

export default AttendanceStatusBadge;
