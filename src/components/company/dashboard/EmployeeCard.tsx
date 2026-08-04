import { RoleEnum } from "../../../types/common-types";
import Image from "../../common/image";
import SnippetWomen from "../../../assets/images/snipetwomen.png";

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
    <div className="p-4 flex flex-col gap-4">
      <GreetingCard />
      <div className="flex flex-col gap-3 rounded-lg justify-center items-center">
        <div className="text-md text-gray-400">
          <i className="fa-solid fa-info-circle"></i>
        </div>
        <div className="flex justify-center">Under Development</div>
        <p className="max-w-md text-sm text-gray-500 leading-relaxed">
          {
            "This feature is currently under development and will be available soon."
          }
        </p>
        {/* <div className="flex-1">
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
        </div> */}
      </div>
    </div>
  );
};

export default EmployeeCard;

const GreetingCard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="relative overflow-hidden bg-[#d4dbf9]">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left */}
        <h2 className="text-[18px] font-medium text-[#2b5aad] px-4 py-4">
          {getGreeting()}
          {" !"}
        </h2>

        {/* Right Illustration */}
        <div className="hidden md:block">
          <Image
            src={SnippetWomen}
            fallbackSrc={SnippetWomen}
            alt="Greeting"
            className="w-[200px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};
