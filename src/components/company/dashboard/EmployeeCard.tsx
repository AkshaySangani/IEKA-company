import { Settings } from "lucide-react";
import { RoleEnum } from "../../../types/common-types";
import Image from "../../common/image";

interface Employee {
  name: string;
  designation: string;
  image: string;
  shift?: string;
  timing?: string;
  branches?: string[];
  departments?: string[];
}

interface EmployeeCardProps {
  role: RoleEnum;
  employee: Employee;
}

const EmployeeCard = ({ role, employee }: EmployeeCardProps) => {
  return (
    <div className="flex gap-5 rounded-lg bg-white p-4">
      <Image
        src={employee.image}
        alt={employee.name}
        className="h-36 w-36 object-cover"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-slate-800">
            {employee.name}
          </h2>

          {employee.designation && (
            <span className="text-sm text-slate-500">
              ({employee.designation})
            </span>
          )}
        </div>

        {role === RoleEnum.MANAGER && (
          <>
            <div className="mt-3 flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />

              <span className="text-sm font-medium text-blue-600">
                {employee.shift}
              </span>

              <span className="text-slate-500">
                ({employee.timing})
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {employee.branches?.map((branch) => (
                <span
                  key={branch}
                  className="rounded bg-slate-100 px-4 py-1 text-xs text-slate-600"
                >
                  {branch}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {employee.departments?.map((department) => (
                <span
                  key={department}
                  className="rounded bg-blue-50 px-4 py-1 text-xs text-slate-600"
                >
                  {department}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;