import React from "react";
import Image from "../../../common/image";
import Modal from "../../../common/modal/Modal";
import {
  AttendanceMethodEnum,
  AttendanceMethodNames,
} from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import NoImage from "../../../../assets/images/User-Image.png";
import { IUser } from "../../../../types/user.types";

export interface ILocationData {
  attendanceMethod: AttendanceMethodEnum | null;
  date: string | null;
  latitude?: number;
  longitude?: number;
}

interface AttendanceLocationProps {
  locationData: ILocationData;
  userDetail: IUser;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const AttendanceLocation: React.FC<AttendanceLocationProps> = ({
  locationData,
  userDetail,
  isOpen,
  onClose,
  className = "",
}) => {
  const { attendanceMethod, date, latitude, longitude } = locationData;

  const mapUrl =
    latitude !== undefined && longitude !== undefined
      ? `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
      : "";

  return (
    <Modal
      isOpen={isOpen}
      title={`${userDetail.firstName} ${userDetail.lastName}`}
      onClose={onClose}
      confirmButtonName="Reject"
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
            sm:grid-cols-[140px_minmax(0,1fr)]
            sm:gap-x-5
            sm:gap-y-6
            md:grid-cols-[170px_minmax(0,1fr)]
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
  );
};

export default AttendanceLocation;
