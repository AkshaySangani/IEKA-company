import Image from "../../common/image";
import SnippetWomen from "../../../assets/images/snipetwomen.png";
import UserAvatar from "../../../assets/images/User-Image.png";
import { useEffect, useState } from "react";

const EmployeeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="w-full bg-white p-3 shadow-[rgba(50,50,93,0.25)_0px_1px_3px_-5px,rgba(0,0,0,0.3)_0px_7px_15px_-8px] sm:p-4">
      {/* Top Greeting */}
      <div className="relative flex min-h-[115px] overflow-hidden  bg-primaryBlur sm:min-h-[130px]">
        {/* Greeting + Punch */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-4 py-4 sm:px-6">
          <div className="text-lg font-medium text-primaryLight sm:text-2xl">
            Good Evening !
          </div>
          <div className="mt-2 text-xs text-primaryDark">
            Punched in at <span className="font-medium">10:02 AM</span>
          </div>
          {/* Punch Button */}
          <button
            type="button"
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-sm border border-primaryLight bg-white px-3 text-sm font-medium text-primaryLight transition hover:bg-primaryLight hover:text-white"
          >
            <i className="fa-solid fa-user-clock text-sm" />
            <span>Punch In</span>
            <span className="text-xs opacity-70">({formattedTime})</span>
          </button>
        </div>

        {/* Illustration */}
        <div className="absolute bottom-0 right-0 flex h-full items-end">
          <Image
            src={SnippetWomen}
            fallbackSrc={SnippetWomen}
            alt="Greeting"
            className="w-[145px] object-contain sm:w-[200px]"
          />
        </div>
      </div>

      {/* Employee Details */}
      <div className="px-1 py-4 sm:px-2 sm:py-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Profile Image */}
          <Image
            src={UserAvatar}
            fallbackSrc={UserAvatar}
            alt="Harsh Kanakhara"
            className="h-14 w-14 shrink-0 rounded-full border border-borderPrimary object-cover sm:h-[68px] sm:w-[68px]"
          />

          {/* Details */}
          <div className="min-w-0 flex-1">
            {/* Name + Designation */}
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h2 className="text-lg font-semibold text-secondary sm:text-xl">
                Harsh Kanakhara
              </h2>

              <span className="text-sm text-grayText">(COO)</span>
            </div>

            {/* Shift */}
            <div className="mt-1.5 text-sm text-grayText">
              {/* <i className="fa-solid fa-sun mr-1.5 text-warning" /> */}

              <span className="font-medium text-secondary">General</span>

              <span className="ml-1 text-grayText">(10:00 to 19:00)</span>
            </div>

            {/* Branches */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Ahmedabad", "Baroda", "Surat"].map((branch) => (
                <span
                  key={branch}
                  className="rounded bg-disabledBg px-2.5 py-1 text-xs text-grayText"
                >
                  {branch}
                </span>
              ))}
            </div>

            {/* Departments */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Account", "Production", "Human Resource", "Sales"].map(
                (department) => (
                  <span
                    key={department}
                    className="rounded bg-pendingBlur px-2.5 py-1 text-xs text-primaryLight"
                  >
                    {department}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
