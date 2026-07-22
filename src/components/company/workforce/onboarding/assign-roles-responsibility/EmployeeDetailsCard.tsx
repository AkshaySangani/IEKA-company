import React, { useEffect, useState } from "react";
import Image from "../../../../common/image";
import {
  employmentTypeOptions,
  probationPeriodOptions,
  roleOptions,
} from "../../../../../constants/constants";
import { IEmployee } from "../employee-details";
import SelectField from "../../../../common/select/SelectField";
import { IBranch, IEmployeeFormData } from ".";
import { getDesignation } from "../../../../../apis/organization/designation.api";
import { IDesignation } from "../../../organization/designation";
import { IOption, RoleEnum, statusEnum } from "../../../../../types/common-types";

interface Props {
  data: IEmployee;
  branches: IBranch[];
  formData: IEmployeeFormData;
  errors: any;
  handleChange: (key: keyof IEmployeeFormData, value: any) => void;
}

const EmployeeDetailCard: React.FC<Props> = ({
  data,
  branches,
  formData,
  errors,
  handleChange,
}) => {

  const [designationOptions, setDesignationOptions] = useState<IOption[]>([]);
  const branchOptions = branches.map(ele => ({label: ele.name, value: ele._id}))
  const selectedBranch = branches.find(
    (branch) => branch._id === formData.branchId,
  );

  const shiftOptions =
    selectedBranch?.shifts.map((shift) => ({
      label: shift.name,
      value: shift._id,
    })) ?? [];

  const selectedShift = selectedBranch?.shifts.find(
    (shift) => shift._id === formData.shiftId,
  );

  const departmentOptions =
    selectedShift?.departments.map((department) => ({
      label: department.name,
      value: department._id,
    })) ?? [];

    useEffect(() => {
      fetchDesignations();
    }, []);

    const fetchDesignations = async () => {
      const response = await getDesignation({page: 1, limit: 200, status: statusEnum.ACTIVE});
      if(response.success){
        setDesignationOptions(response?.data?.designations?.map((ele: IDesignation) => ({label: ele?.name, value: ele?._id})))
      } else {
        setDesignationOptions([]);
      }
    }
  return (
    <div className="content-card bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-primary p-2.5 flex items-center gap-4">
        <div className="w-[100px] bg-white flex items-center justify-center">
          <Image
            src={data.profileImage}
            alt={data.firstName}
            className="max-h-16 object-contain"
          />
        </div>

        <h2 className="text-lg text-white font-semibold">
          {data.firstName} {data.lastName}
        </h2>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 border-b pb-3 mb-4">
          <i className="fa-solid fa-user-clock px-2 py-1.5 text-base bg-[#212936] text-white h-7.5 w-7.5 flex items-center justify-center"></i>
          <h3 className="text-md text-gray-600 font-semibold">
            Employment Details
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Organizational Role"
            value={formData.role ? (roleOptions.find(ele => ele.value === formData.role)??"") : ""}
            name={"role"}
            error={errors?.role}
            options={roleOptions}
            onChange={(option) => handleChange("role", option.value)}
            required
          />
          <SelectField
            label="Designation"
            value={formData.designationId ? (designationOptions.find(ele => ele.value === formData.designationId)??"") : ""}
            name={"designationId"}
            options={designationOptions}
            error={errors?.designationId}
            onChange={(option) => handleChange("designationId", option.value)}
            required
          />
          {formData.role === RoleEnum.MANAGER && (<><SelectField
            label="Reporting Branch"
            value={formData.branchId ? (branchOptions.find(ele => ele.value === formData.branchId)??"") : ""}
            name={"branchId"}
            options={branchOptions}
            error={errors?.branchId}
            onChange={(option) => handleChange("branchId", option.value)}
            required
          />
          <SelectField
            label="Reporting Shift"
            value={formData.shiftId ? (shiftOptions.find(ele => ele.value === formData.shiftId)??"") : ""}
            name={"shiftId"}
            options={shiftOptions}
            error={errors?.shiftId}
            onChange={(option) => handleChange("shiftId", option.value)}
            required
          />
          <SelectField
            label="Reporting Department"
            value={formData.departmentId ? (departmentOptions.find(ele => ele.value === formData.departmentId)??"") : ""}
            name={"departmentId"}
            options={departmentOptions}
            error={errors?.departmentId}
            onChange={(option) => handleChange("departmentId", option.value)}
            required
          /></>)}
          <SelectField
            label="Employment Type"
            value={formData.employmentType ? (employmentTypeOptions.find(ele => ele.value === formData.employmentType)??"") : ""}
            name={"employmentType"}
            options={employmentTypeOptions}
            error={errors?.employmentType}
            onChange={(option) => handleChange("employmentType", option.value)}
            required
          />
          <SelectField
            label="Probational Period"
            value={(probationPeriodOptions.find(ele => ele.value === formData.probationPeriod)??"")}
            name={"probationPeriod"}
            options={probationPeriodOptions}
            error={errors?.probationPeriod}
            onChange={(option) => handleChange("probationPeriod", option.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailCard;
