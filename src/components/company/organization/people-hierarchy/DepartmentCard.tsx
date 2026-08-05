import { Info } from "lucide-react";
import { IDepartment } from ".";
import { roleNames, statusBgColor } from "../../../../constants/constants";
import { statusEnum } from "../../../../types/common-types";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import PersonInfo from "../../../common/person-info";

interface DepartmentCardProps {
  department: IDepartment;
}
export default function DepartmentCard({ department }: DepartmentCardProps) {
  return (
    <>
      <div className="content-card p-2.5 max-h-[350px]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#4F79C7] px-5 py-1 text-white">
          <div className="flex items-center gap-2 ">
            <span
              className={`w-2.5 h-2.5 rounded-full ring-1 ring-gray-200 ${statusBgColor[department.status]}`}
            ></span>
            <span className="text-sm font-medium">{department?.name}</span>
          </div>

          <div className="flex px-[5px] py-[3px] min-w-[35px] items-center justify-center bg-white text-[20px] font-medium text-[#505050] shadow">
            {department.count}
          </div>
        </div>

        {department.manager && (
          <>
            <div className="flex flex-col items-center py-6">
              <PersonInfo
                personInfo={{
                  profileImage: department.manager.profileImage,
                  firstName: department.manager.firstName,
                  lastName: department.manager.lastName,
                  description: `(${roleNames[department.manager.role]})`,
                  status: department.manager.status,
                }}
                imageClassName="h-[55px] w-[55px]"
                className="flex-col items-center text-center !gap-1"
                personClassName="text-secondary text-xs"
              />
            </div>

            <div className="mx-5 border-b border-gray-300" />
          </>
        )}

        {/* Employees */}
        {department?.employee?.length > 0 ? (
          <div className="grid grid-cols-2 gap-y-6 gap-x-2 px-2 py-6 md:grid-cols-3 lg:grid-cols-3">
            {department.employee.map((employee) => (
              <PersonInfo
                key={employee._id}
                personInfo={{
                  profileImage: employee.profileImage,
                  firstName: employee.firstName,
                  lastName: employee.lastName,
                  description: `(${roleNames[employee.role]})`,
                  status: employee.status,
                }}
                imageClassName="h-[50px] w-[50px]"
                className="flex flex-col items-center text-center"
                personClassName="text-secondary text-xs truncate w-[110px]"
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder icon={<Info size={25} />} className="!h-[300px]" />
        )}
      </div>
    </>
  );
}
