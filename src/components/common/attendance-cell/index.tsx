import React from "react";
import { LocateFixed } from "lucide-react";
import { AttendanceMethodNames } from "../../../types/common-types";

export enum LeaveType {
  CL = "CL",
  SL = "SL",
  EL = "EL",
  LWP = "LWP",
}

export interface PunchData {
  time: string;
  source: AttendanceMethodNames;
}

export interface LeaveData {
  type: string;
  color: string;
}

export interface AttendanceCellData {
  inPunch?: PunchData;
  outPunch?: PunchData;

  inLeave?: LeaveData;
  outLeave?: LeaveData;

  fullDayLeave?: LeaveData;
}

interface AttendanceCellProps {
  data?: AttendanceCellData;
  className?: string;
}

const AttendanceCell: React.FC<AttendanceCellProps> = ({
  data,
  className = "",
}) => {
  if (!data) {
    return (
      <div
        className={`flex items-center justify-center text-gray-500 ${className}`}
      >
        -
      </div>
    );
  }

  if (data.fullDayLeave) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LeaveBadge leave={data.fullDayLeave} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col items-center justify-center gap-1 min-w-[120px]">
        {data.inLeave && <LeaveBadge leave={data.inLeave} />}

        {!data.inLeave && data.inPunch && <PunchInfo punch={data.inPunch} />}
        {data.outLeave && data.outPunch && <PunchInfo punch={data.outPunch} />}
      </div>

      <span className="font-medium text-gray-600">-</span>

      <div className="flex flex-col items-center justify-center gap-1 min-w-[120px]">
        {data.inLeave && data.inPunch && <PunchInfo punch={data.inPunch} />}
        {!data.outLeave && data.outPunch && <PunchInfo punch={data.outPunch} />}

        {data.outLeave && <LeaveBadge leave={data.outLeave} />}
      </div>
    </div>
  );
};

export default AttendanceCell;

interface PunchInfoProps {
  punch: PunchData;
}

const PunchInfo: React.FC<PunchInfoProps> = ({ punch }) => {
  return (
    <div className="text-center flex items-center gap-2">
      <div className="font-medium text-sm leading-none border-r border-secondary/50 pr-2">
        {punch.time}
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500">
        <span className="capitalize">{punch.source}</span>

        <LocateFixed size={15} className="text-indigo-500" strokeWidth={2} />
      </div>
    </div>
  );
};

interface LeaveBadgeProps {
  leave: LeaveData;
}

const LeaveBadge: React.FC<LeaveBadgeProps> = ({ leave }) => {
  return (
    <div
      className={`px-8 flex items-center justify-center font-medium text-md bg-white border-[1.5px] ${leave?.color}`}
    >
      {leave.type}
    </div>
  );
};
