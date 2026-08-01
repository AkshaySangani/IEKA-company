import { useState } from "react";
import {
  IBranch,
  IDepartment,
  IManager,
  IShift,
} from "../../workforce/onboarding/assign-roles-responsibility";
import Modal from "../../../common/modal/Modal";
import PersonInfo from "../../../common/person-info";
import { roleNames } from "../../../../constants/constants";

interface BranchCardProps {
  branch: IBranch;
}
export default function BranchCard({ branch }: BranchCardProps) {
  return (
    <>
      <div className="content-card">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#4F79C7] px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-building"></i>
            <h2 className="text-md font-medium">{branch?.name}</h2>
          </div>

          <div className="flex px-[5px] py-[3px] min-w-[35px] items-center justify-center bg-white text-[20px] font-medium text-[#505050] shadow">
            {branch.count}
          </div>
        </div>

        {/* Address */}
        <div className="px-5 pt-2 pb-3">
          <p className="text-[13px] text-[#5c5c5c]">{branch.address} (HO)</p>
        </div>

        {/* Shift Card */}
        {branch?.shifts?.map((shift: IShift, index: number) => (
          <div
            key={index}
            className="mx-3 mb-5 overflow-hidden border p-3 border-gray-300 bg-white"
          >
            {/* Shift Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <i className="fa-solid fa-sun"></i>
                  <span className="text-sm font-medium">{shift?.name}</span>
                </div>

                <p className=" text-xs text-gray-500">
                  {`Time : (${shift.startTime} to ${shift.endTime})`}
                </p>
              </div>

              <span className="text-md font-medium text-gray-700">
                {shift.count}
              </span>
            </div>

            {/* Departments */}
            {shift.departments.map((item, index) => (
              <Department item={item} shift={shift} index={index} key={index} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

const Department = ({
  item,
  shift,
  index,
}: {
  item: IDepartment;
  shift: IShift;
  index: number;
}) => {
  const [employees, setEmployees] = useState<IManager[]>([]);
  return (
    <>
      <div
        key={item.name}
        className={`flex items-center justify-between px-2 py-2 ${
          index !== shift.departments.length - 1
            ? "border-b border-gray-200"
            : ""
        }`}
      >
        <span className="text-sm font-medium text-[#727272]">
          {item.name}
        </span>

        <span
          className="text-sm font-medium cursor-pointer text-[#727272]"
          onClick={() => setEmployees(item.employee)}
        >
          {item.count}
        </span>
      </div>
      <Modal
        isOpen={employees?.length > 0}
        title={"Employees"}
        onClose={() => setEmployees([])}
        width="max-w-3xl"
        showFooter={false}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-center bg-[#dde9f5] p-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">
                {shift.name} | {item.name}
              </div>
              <div className="bg-primary px-3 py-1 text-white font-medium text-center">
                {item.count}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {employees?.map((ele: IManager, id: number) => (
              <PersonInfo
                personInfo={{
                  profileImage: ele.profileImage,
                  firstName: ele.firstName,
                  lastName: ele.lastName,
                  description: roleNames[ele.role],
                }}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
