import React from "react";
import Image from "../image";
import NoImage from "../../../assets/images/User-Image.png";

export interface IUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

interface EmployeeActivityCardProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  users: IUserSummary[];
  onClick?: () => void;
  className?: string;
}

export default function EmployeeActivityCard({
  title,
  icon,
  count,
  users,
  onClick,
  className = "",
}: EmployeeActivityCardProps) {
  return (
    <div
      onClick={onClick}
      // style={active ? { backgroundColor: activeColor } : undefined}
      className={`
        min-w-[140px]
        cursor-pointer
        select-none
        px-3
        py-[10px]
        bg-cardBg
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#545454]">
          <div className="text-sm">{icon}</div>

          <span className="text-sm font-semibold">{title}</span>
        </div>

        <span className="text-md font-semibold text-secondary">
          {count}
        </span>
      </div>

      {/* Users */}
      <div className="mt-5 flex items-center">
        {users.slice(0, 4).map((user, index) => (
          <div
            key={user._id}
            className={`${index !== 0 ? "-ml-2" : ""} transition-all
        duration-200
        hover:-translate-y-[5px]`}
          >
            <Image
              src={user.profileImage}
              fallbackSrc={NoImage}
              alt={user.firstName}
              className="h-[35px] w-[35px] rounded-full border-2 border-white object-cover"
            />
          </div>
        ))}

        {users.length > 4 && (
          <div className="-ml-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-semibold text-white">
            +{users.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}