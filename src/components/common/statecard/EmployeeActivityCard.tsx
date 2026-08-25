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
  defaultCount?: number;
  onClick?: () => void;
  className?: string;
}

export default function EmployeeActivityCard({
  title,
  icon,
  count,
  users,
  onClick,
  defaultCount = 3,
  className = "",
}: EmployeeActivityCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        select-none
        bg-cardBg
        px-3
        py-3
        transition-all
        duration-200
        hover:bg-[#e5e5e5]
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 text-secondary">
          <span className="w-[18px] text-center text-sm">{icon}</span>

          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>

      {/* Users + Count */}
      <div className="mt-3 flex items-center">
        <div className="flex items-center gap-2">
          {users.slice(0, defaultCount).map((user, index) => (
            <div
              key={user._id}
              className={`
                relative
                h-[35px]
                w-[35px]
              `}
            >
              <Image
                src={user.profileImage}
                fallbackSrc={NoImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="
                  h-[35px]
                  w-[35px]
                  rounded-full
                  border-2
                  object-cover
                "
              />
            </div>
          ))}
        </div>

        {/* Count */}
        {count > defaultCount && (
          <span className="ml-2 text-sm font-medium text-secondary">
            +{count - defaultCount}
          </span>
        )}
      </div>
    </div>
  );
}
