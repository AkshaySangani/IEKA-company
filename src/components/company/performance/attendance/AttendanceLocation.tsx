import React, { useState } from "react";
import Image from "../../../common/image";
import Modal from "../../../common/modal/Modal";
import {
  AttendanceMethodEnum,
  AttendanceMethodNames,
  AttendanceStatusEnum,
  RoleEnum,
} from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import NoImage from "../../../../assets/images/User-Image.png";
import { IUser } from "../../../../types/user.types";
import { rejectAttendance } from "../../../../apis/performance/attendance.api";
import { IUserAttendance } from ".";
import { useAuthStore } from "../../../../store/auth-store";

export interface ILocationData {
  attendanceMethod: AttendanceMethodEnum | null;
  date: string | null;
  latitude?: number;
  longitude?: number;
  attendance: IUserAttendance;
}

interface AttendanceLocationProps {
  locationData: ILocationData;
  userDetail: IUser;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  refreshData: () => void;
}

const AttendanceLocation: React.FC<AttendanceLocationProps> = ({
  locationData,
  userDetail,
  isOpen,
  onClose,
  className = "",
  refreshData,
}) => {
  const { user } = useAuthStore();
  const { attendanceMethod, date, latitude, longitude, attendance } =
    locationData;
  const isManager =
    user.role === RoleEnum.MANAGER && user._id === attendance.userId._id;

  const [loading, setLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const mapUrl =
    latitude !== undefined && longitude !== undefined
      ? `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
      : "";

  const handleRejectAttendance = async () => {
    setLoading(true);
    const response = await rejectAttendance(attendance._id);
    if (response.success) {
      refreshData();
      onClose();
    }
    setLoading(true);
  };

  const handleOpenClose = () => {
    setConfirm((prev) => !prev);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={`${userDetail.firstName} ${userDetail.lastName}`}
        onClose={onClose}
        confirmButtonName="Reject"
        handleOnConfirm={handleOpenClose}
        showFooter={
          !isManager &&
          attendance.attendanceStatus !== AttendanceStatusEnum.REJECTED
        }
      >
        <div
          className={`
          w-full
          px-1
          sm:px-2
          ${className}
        `}
        >
          {/* Profile Image */}
          <div className="flex justify-center">
            <Image
              src={userDetail.profileImage}
              alt="Employee"
              fallbackSrc={NoImage}
              className="
              h-20 w-20
              sm:h-[100px] sm:w-[100px]
              rounded-full
              object-cover
            "
            />
          </div>

          {/* Details */}
          <div
            className="
            mt-5
            grid
            grid-cols-1
            gap-y-4
          "
          >
            {/* Attendance Marked */}
            <div className="flex gap-2">
              <div className="text-start text-sm font-normal text-inputLabel">
                Attendance Marked:
              </div>

              <div className="text-start text-sm font-semibold text-secondary">
                {attendanceMethod
                  ? AttendanceMethodNames[attendanceMethod]
                  : "N/A"}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-2">
              <div className="text-start text-sm font-normal text-inputLabel">
                Date & Time:
              </div>

              <div className="min-w-0">
                <div className="text-start text-sm font-semibold text-secondary">
                  {formatDate(date)}
                </div>

                <div className="mt-1 text-start text-xs text-info">
                  {formatDate(date, DateFormat.TIME_24)}
                </div>
              </div>
            </div>

            {/* Geo Location */}
            {latitude && longitude && (
              <>
                <div className="text-start text-sm font-normal text-inputLabel">
                  Geo Location:
                </div>

                <div className="min-w-0">
                  {latitude !== undefined && longitude !== undefined ? (
                    <div
                      className="
                  relative
                  h-[220px]
                  w-full
                  overflow-hidden
                  rounded-md
                  border
                  border-gray-200
                  sm:h-[280px]
                  md:h-[350px]
                  lg:h-[375px]
                "
                    >
                      <iframe
                        title="Attendance Location"
                        src={mapUrl}
                        className="h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-200 px-3 py-4 text-sm text-gray-500">
                      Location not available
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={confirm}
        loading={loading}
        handleOnConfirm={handleRejectAttendance}
        title={"Reject Attendance"}
        onClose={handleOpenClose}
        confirmButtonName="Reject"
        width="max-w-lg"
      >
        <div
          className={`
          w-full
          px-1
          sm:px-2
          ${className}
        `}
        >
          {/* Profile Image */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image
              src={userDetail.profileImage}
              alt="Employee"
              fallbackSrc={NoImage}
              className="
              h-10 w-10
              sm:h-[50px] sm:w-[50px]
              rounded-full
              object-cover
            "
            />
            <div className="text-lg font-medium">
              Are you sure you want to reject attendance?
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttendanceLocation;
