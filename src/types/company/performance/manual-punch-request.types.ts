import { AttendanceStatusEnum } from "../../common-types";
import { IUser } from "../../user.types";

export type PunchType = "in" | "out" | "both";

export interface IManualPunch {
  date: string;
  inTime: string;
  outTime: string;
}

export interface IManualPunchRequest {
  userId: string;
  punchType: PunchType;
  manual: IManualPunch;
}

export interface IManualPunchErrors {
  userId?: string;
  punchType?: string;
  manual?: {
    date?: string;
    inTime?: string;
    outTime?: string;
  };
}


export interface IPunchManualRequest {
  _id: string;
  userId: IUser;
  attendanceDate: string;
  inTime: string | null;
  outTime: string | null;
  totalWorkedMinutes: number;
  attendanceStatus: AttendanceStatusEnum;
  isManualPunchIn: boolean;
  isManualPunchOut: boolean;
  updatedAt: string;
}