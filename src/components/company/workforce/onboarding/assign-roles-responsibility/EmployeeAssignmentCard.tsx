import Image from "../../../../common/image";
import { RoleEnum } from "../../../../../types/common-types";
import { IAssignment, IBranch, IEmployeeFormData } from ".";
import { getDateDifference } from "../../../../../utils/date-format";
import { BranchAssignmentFormData } from "../../all-employees/employee-details/update-modals/BranchAssignmentUpdate";

interface IEmployeeAssignmentCardProps {
  data: IBranch;
  formData: IEmployeeFormData | BranchAssignmentFormData;
  handleAssignmentChange: (assignment: IAssignment) => void;
}

const EmployeeAssignmentCard = ({
  data,
  formData,
  handleAssignmentChange,
}: IEmployeeAssignmentCardProps) => {

  const isSelected = (branchId: string,shiftId: string,departmentId: string) => {
    return formData.assignments.some(
      (item) =>
        item.branchId === branchId &&
        item.shiftId === shiftId &&
        item.departmentId === departmentId,
    );
  };

  return (
    <div className="content-card border p-3">
      {/* Header */}

      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#1F2937] text-white">
            <i className="fa-solid fa-building"></i>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-md text-secondary font-medium">{data.name}</h3>

            <div className="h-8 w-px bg-gray-300" />

            <span className="text-md font-semibold text-gray-500">
              Total Employee : {data.count}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-600">
            Selected Employee :
          </span>

          <div className="flex py-1 px-2.5 items-center justify-center bg-primary text-white font-semibold">
            {formData.assignments.filter(ele => ele?.branchId === data._id)?.length}
          </div>
        </div>
      </div>

      {/* Shift Details */}
      <div className="flex mt-2">
        <span className="text-xs text-gray-500">{data.address}</span>
      </div>
      {data.shifts?.length > 0 &&
        data.shifts?.map((shift, index) => (
          <div>
            <div className="mt-3 inline-flex bg-blue-50 p-2">
              <div className="pr-6">
                <p className="font-medium text-xs text-primary">
                  <i className="fa-solid fa-sun mr-2" />
                  {shift.name}
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  {`Time : (${shift.startTime} to ${shift.endTime})`}
                </p>

                <p className="text-xs text-gray-600">
                  {`Lunch : (${shift.breakStartTime} to ${shift.breakEndTime})`}
                </p>
              </div>

              <div className="mx-6 w-px bg-gray-300" />

              <div className="pr-6">
                <p className="mt-7 text-xs font-semibold">{getDateDifference({from:shift.startTime, to: shift.endTime,unit: "hours"})} hours</p>
              </div>

              <div className="mx-6 w-px bg-gray-300" />

              <div>
                <p className="mt-7 text-xs text-gray-600">
                  Total Employee{" "}
                  <span className="text-xs font-semibold">{shift.count}</span>
                </p>
              </div>
            </div>

            {/* Departments */}
            {shift.departments?.length > 0 &&
                <div className="mt-4 space-y-3">
                  {shift.departments.map((department) => {
                    const checked = isSelected(data._id, shift._id,department._id);

                    const assignment: IAssignment = {
                      branchId: data._id,
                      shiftId: shift._id,
                      departmentId: department._id,
                      designationId: formData.designationId,
                      isReporting: true,
                      remarks: "",
                    };

                    return (
                      <div
                        key={department._id}
                        className="grid grid-cols-[1fr_6fr_1fr_6fr] items-center gap-2"
                      >
                        {/* Checkbox / Radio */}

                        {formData.role === RoleEnum.EMPLOYEE ? (
                          <input
                            type="radio"
                            checked={checked}
                            onChange={() =>
                              handleAssignmentChange({
                                ...assignment,
                                isReporting: false,
                              })
                            }
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={department?.manager ? department?.manager?._id !== formData?.userId : checked}
                            disabled={department?.manager ? department?.manager?._id !== formData?.userId : false}
                            onChange={() =>
                              handleAssignmentChange({
                                ...assignment,
                                isReporting: false,
                              })
                            }
                          />
                        )}

                        {/* Department */}

                        <span className="text-sm font-medium">
                          {department.name}
                        </span>

                        <div className="border-l pl-4 text-sm">
                          {department.count}
                        </div>

                        {/* Manager */}

                        {department?.manager ? <div className="flex items-center gap-2">
                          <Image
                            src={department?.manager?.profileImage}
                            className="h-[30px] w-[30px] object-cover"
                          />

                          <div>
                            <p className="font-medium text-sm text-primary">
                              {department?.manager?.firstName}{" "}{department?.manager?.lastName}
                            </p>

                            {/* <p className="text-gray-500 text-xs">(569845)</p> */}
                          </div>
                        </div>: <></>}
                      </div>
                    );
                  })}
                </div>
}
          </div>
        ))}
    </div>
  );
};

export default EmployeeAssignmentCard;
