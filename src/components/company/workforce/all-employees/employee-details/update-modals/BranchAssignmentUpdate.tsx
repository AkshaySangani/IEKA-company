import { useEffect, useState } from "react";
import {
    RoleEnum,
} from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import { getBranchShiftDepartment } from "../../../../../../apis/workforce/onboardings.api";
import {
  IAssignment,
  IBranch,
} from "../../../onboarding/assign-roles-responsibility";
import EmployeeAssignmentCard from "../../../onboarding/assign-roles-responsibility/EmployeeAssignmentCard";
import { IEmployee, IAssignment as Assignment } from "..";
import TextAreaField from "../../../../../common/text-area/TextAreaField";

interface BranchAssignmentUpdateProps {
  active: boolean;
  loading: boolean;
  role: RoleEnum | string;
  employeeData: IEmployee;
  assignments: Assignment[];
  setActive: (value: boolean) => void;
  handleSubmit: (payload: any) => void;
}

export interface BranchAssignmentFormData {
  role: RoleEnum;
  userId: string;
  designationId: string;
  assignments: IAssignment[];
  remarks: string;
}
export default function BranchAssignmentUpdate({
  active,
  loading,
  role,
  employeeData,
  assignments,
  setActive,
  handleSubmit,
}: BranchAssignmentUpdateProps) {
  const initialFormData: BranchAssignmentFormData = {
    role: RoleEnum.EMPLOYEE,
    designationId: "",
    assignments: [],
    remarks: "",
    userId: ""
  };
  const [formData, setFormData] =
    useState<BranchAssignmentFormData>(initialFormData);

  const [branches, setBranches] = useState<IBranch[]>([]);

  useEffect(() => {
    if(assignments?.length > 0 && role === "MANAGER"){
        setFormData(prev => ({...prev,designationId: employeeData.designationId,userId: employeeData?._id, role: role === "MANAGER" ? RoleEnum.MANAGER : RoleEnum.EMPLOYEE,assignments: assignments.map(ele => ({
            branchId: ele.branchId._id,
            shiftId: ele.shiftId._id,
            departmentId: ele.departmentId._id,
            designationId: employeeData.designationId,
            isReporting: ele.isReporting,
            remarks: ele.remarks,
        }))}))
    } else {
        const data = assignments[0];
        setFormData(prev => ({...prev,designationId: employeeData.designationId,userId: employeeData?._id, role: role === "MANAGER" ? RoleEnum.MANAGER : RoleEnum.EMPLOYEE,assignments: [{
            branchId: data.branchId._id,
            shiftId: data.shiftId._id,
            departmentId: data.departmentId._id,
            designationId: employeeData.designationId,
            isReporting: data.isReporting,
            remarks: data.remarks,
        }]}))
    }
  }, [assignments,role,employeeData])
  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  const fetchBranchShiftDepartment = async () => {
    const response = await getBranchShiftDepartment();
    if (response?.success) {
      setBranches(response?.data);
    } else {
      setBranches([]);
    }
  };

  const handleAssignmentChange = (assignment: IAssignment) => {
    console.log("assignment",assignment)
    setFormData((prev) => {
      // Employee → single assignment
      if (prev.role === RoleEnum.EMPLOYEE) {
        return {
          ...prev,
          assignments: [assignment],
        };
      }

      // Manager → multiple assignments
      const alreadyExists = prev.assignments.some(
        (item) =>
          item.branchId === assignment.branchId &&
          item.shiftId === assignment.shiftId &&
          item.departmentId === assignment.departmentId &&
          item.designationId === assignment.departmentId,
      );

      return {
        ...prev,
        assignments: alreadyExists
          ? prev.assignments.filter(
              (item) =>
                !(
                  item.branchId === assignment.branchId &&
                  item.shiftId === assignment.shiftId &&
                  item.departmentId === assignment.departmentId &&
                  item.designationId === assignment.designationId
                ),
            )
          : [...prev.assignments, assignment],
      };
    });
  };

  const handleOnSubmit = async () => {
    await handleSubmit({assignments:formData.assignments.map(ele => ({...ele,remarks: formData.remarks}))});
  }
  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData.lastName}`}
      onClose={() => setActive(false)}
      width="max-w-6xl"
      handleOnConfirm={handleOnSubmit}
      loading={loading}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={employeeData.profileImage}
          title="Are you sure you want to update branch for this employee?"
        />
        {formData.role && branches?.length > 0 ? (
          branches.map((branch, index) => (
            <EmployeeAssignmentCard
              key={index}
              formData={formData}
              data={branch}
              handleAssignmentChange={handleAssignmentChange}
            />
          ))
        ) : (
          <></>
        )}
        <TextAreaField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          placeholder="Enter remarks..."
          onChange={(e) => setFormData(prev => ({...prev,["remarks"]: e.target.value}))}
        />
      </div>
    </Modal>
  );
}
