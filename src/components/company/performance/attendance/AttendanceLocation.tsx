import React from "react";
import Image from "../../../common/image";
import Modal from "../../../common/modal/Modal";
import { AttendanceMethodEnum, AttendanceMethodNames } from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import NoImage from "../../../../assets/images/User-Image.png";
import { IUser } from "../../../../types/user.types";

export interface ILocationData {
  attendanceMethod: AttendanceMethodEnum;
  date: string;
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
  const { attendanceMethod, date, latitude, longitude } =
    locationData;
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

//   const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <Modal isOpen={isOpen} title={`${userDetail.firstName} ${userDetail.lastName}`} onClose={onClose} confirmButtonName={"Reject"}>
      <div
        className={`w-full ${className}`}
      >
        {/* Profile Image */}
        <div className="flex justify-center">
          <Image
            src={userDetail.profileImage}
            alt="Employee"
            fallbackSrc={NoImage}
            className="h-[100px] w-[100px] object-cover"
          />
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-[170px_1fr] gap-y-6">
          {/* Attendance Marked */}
          <div className="text-sm font-normal text-inputLabel text-start">
            Attendance Marked
          </div>

          <div className="text-sm font-semibold text-secondary text-start">
            {AttendanceMethodNames[attendanceMethod]}
          </div>

          {/* Date & Time */}
          <div className="text-sm font-normal text-inputLabel text-start">
            Date & Time
          </div>

          <div>
            <div className="text-sm font-semibold text-secondary text-start">
              {formatDate(date)}
            </div>

            <div className="mt-1 text-xs text-info text-start">{formatDate(date, DateFormat.TIME_24)}</div>
          </div>

          {/* Geo Location */}
          <div className="text-sm font-normal text-inputLabel text-start">
            Geo Location
          </div>

          <div>
            {/* Map */}
            <div className="relative h-[375px] w-full overflow-hidden rounded-sm border border-gray-200">
              <iframe
                title="Attendance Location"
                src={mapUrl}
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceLocation;
