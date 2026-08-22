import { useState } from "react";
import { IUserAttendance } from ".";
import {
  AttendanceMethodNames,
  AttendanceStatusEnum,
  LeaveDuration,
} from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import { getFirstCharacter } from "../../../../utils/helper";
import AttendanceCell from "../../../common/attendance-cell";
import AttendanceLocation from "./AttendanceLocation";

interface CheckInCheckOutProps {
  attendance: IUserAttendance;
}

export default function CheckInCheckOut({ attendance }: CheckInCheckOutProps) {
  const [location, setLocation] = useState<keyof IUserAttendance | null>(null);
  const isInLocation = location === "inLocation";
  return (
    <>
      <div className="flex justify-center">
        {/* Present */}
        <AttendanceCell
          data={{
            inPunch:
              attendance.inTime && attendance.inMethod
                ? {
                    time: formatDate(attendance.inTime, DateFormat.TIME_24),
                    source: AttendanceMethodNames[attendance.inMethod],
                  }
                : undefined,

            outPunch:
              attendance.outTime && attendance.outMethod
                ? {
                    time: formatDate(attendance.outTime, DateFormat.TIME_24),
                    source: AttendanceMethodNames[attendance.outMethod],
                  }
                : undefined,

            inLeave:
              (attendance.lateMinutes && attendance.isHalfDay) ||
              (attendance.isHalfDay &&
                attendance.leaveRequestId &&
                attendance.leaveRequestId.duration === LeaveDuration.FIRST_HALF)
                ? {
                    type: getFirstCharacter(
                      attendance.leaveRequestId?.leaveId.name ?? "FH",
                    ),
                    color: "border-warning text-warning",
                  }
                : undefined,

            outLeave:
              (attendance.earlyExitMinutes && attendance.isHalfDay) ||
              (attendance.isHalfDay &&
                attendance.leaveRequestId &&
                attendance.leaveRequestId.duration ===
                  LeaveDuration.SECOND_HALF)
                ? {
                    type: getFirstCharacter(
                      attendance.leaveRequestId?.leaveId.name ?? "SH",
                    ),
                    color: "border-warning text-warning",
                  }
                : undefined,

            fullDayLeave:
              attendance.attendanceStatus === AttendanceStatusEnum.LEAVE &&
              attendance.leaveRequestId
                ? {
                    type: getFirstCharacter(
                      attendance.leaveRequestId?.leaveId.name,
                    ),
                    color: "border-warning text-warning",
                  }
                : undefined,
          }}
          onClick={(value: "inLocation" | "outLocation") => {
            (attendance.inLocation || attendance.outLocation) &&
              setLocation(value);
          }}
        />
      </div>
      <AttendanceLocation
        isOpen={location !== null}
        onClose={() => setLocation(null)}
        locationData={{
          latitude: isInLocation
            ? attendance.inLocation?.latitude
            : attendance.outLocation?.latitude,
          longitude: isInLocation
            ? attendance.inLocation?.longitude
            : attendance.outLocation?.longitude,
          date: isInLocation ? attendance.inTime : attendance.outTime,
          attendanceMethod: isInLocation
            ? attendance.inMethod
            : attendance.outMethod,
        }}
        userDetail={attendance.userId}
      />
    </>
  );
}
