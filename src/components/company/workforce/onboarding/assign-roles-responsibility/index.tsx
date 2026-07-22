import { useLocation, useNavigate } from "react-router-dom";
import { pathNames } from "../../../../../constants/constants";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import { useEffect, useRef, useState } from "react";
import {
  assignRolesAndResponsibility,
  getBranchShiftDepartment,
} from "../../../../../apis/workforce/onboardings.api";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import EmployeeDetailCard from "./EmployeeDetailsCard";
import PageLoader from "../../../../common/loader/PageLoader";
import { IEmployee } from "../employee-details";
import { RoleEnum } from "../../../../../types/common-types";
import PolicyDetailsCard from "./PolicyDetails";
import SalaryDetailsCard from "./SalaryDetails";
import EmployeeAssignmentCard from "./EmployeeAssignmentCard";

export interface IManager {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
}

export interface IAssignment {
  branchId: string;
  shiftId: string;
  departmentId: string;
  designationId: string;
  isReporting: boolean;
  remarks: string;
}

export interface IEmployeeFormData {
  userId: string;
  role: string;
  employmentType: string;
  probationPeriod: number;
  policyId: string;
  payslipId: string;
  salary: number;
  assignments: IAssignment[];
  remarks: string;

  branchId: string;
  shiftId: string;
  departmentId: string;
  designationId: string;
}

export interface IDepartment {
  _id: string;
  name: string;
  count: number;
  manager?: IManager;
}

export interface IShift {
  _id: string;
  name: string;
  departments: IDepartment[];
  count: number;
  endTime: string;
  startTime: string;
  breakEndTime: string;
  breakStartTime: string;
}

export interface IBranch {
  _id: string;
  name: string;
  address: string;
  shifts: IShift[];
  count: number;
}

const AssignRolesResponsibility = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const employeeId = location?.state?.id;
  const employee: IEmployee = location?.state?.employee;

  const initialEmployeeFormData: IEmployeeFormData = {
    userId: "",
    role: "",
    employmentType: "",
    probationPeriod: 0,
    policyId: "",
    payslipId: "",
    salary: 0,
    assignments: [],
    remarks: "",

    branchId: "",
    shiftId: "",
    departmentId: "",
    designationId: "",
  };

  const [formData, setFormData] = useState<IEmployeeFormData>(
    initialEmployeeFormData,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [branches, setBranches] = useState<IBranch[]>([]);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  const fetchBranchShiftDepartment = async () => {
    setLoading(true);
    const response = await getBranchShiftDepartment();
    if (response?.success) {
      setBranches(response?.data);
    } else {
      setBranches([]);
    }
    setLoading(false);
  };

  const handleChange = (key: keyof IEmployeeFormData, value: any) => {
    if (key === "role") {
      setFormData((prev) => {
        return {
          ...initialEmployeeFormData,
          [key]: value,
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [key]: value,
        };
      });
    }

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleAssignmentChange = (assignment: IAssignment) => {
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
          item.designationId === assignment.designationId,
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

  // handle validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    const employeeAssignment = formData.assignments.find(
      (item) => !item.isReporting,
    );

    if (!formData.role) {
      newErrors.role = "Organization role is required";
    }

    if (!formData.designationId) {
      newErrors.designationId = "Designation is required";
    }

    if (formData.role === RoleEnum.MANAGER) {
      if (!formData?.branchId) {
        newErrors.branchId = "Branch is required";
      }

      if (!formData?.shiftId) {
        newErrors.shiftId = "Shift is required";
      }

      if (!formData?.departmentId) {
        newErrors.departmentId = "Department is required";
      }
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Employment type is required";
    }

    if (formData.probationPeriod !== 0 && !formData.probationPeriod) {
      newErrors.probationPeriod = "Probation Period type is required";
    }

    // Employee assignment
    if (formData.role === RoleEnum.EMPLOYEE) {
      if (!employeeAssignment?.departmentId) {
        newErrors.employee_departmentId = "Department is required";
      }
    }
    // Common fields

    if (!formData.payslipId) {
      newErrors.payslipId = "Payslip is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const scrollToFirstError = (errors: Record<string, any>) => {
    if (!formRef.current) return;

    const findFirstErrorKey = (
      obj: Record<string, any>,
      parentKey = "",
    ): string | null => {
      for (const key in obj) {
        const value = obj[key];
        const currentKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "string" && value) {
          return currentKey;
        }

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const nestedKey = findFirstErrorKey(value[i], `${currentKey}.${i}`);
            if (nestedKey) return nestedKey;
          }
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
          const nestedKey = findFirstErrorKey(value, currentKey);
          if (nestedKey) return nestedKey;
        }
      }

      return null;
    };

    const firstErrorKey = findFirstErrorKey(errors);

    if (!firstErrorKey) return;

    const field =
      (formRef.current.querySelector(
        `[name="${firstErrorKey}"]`,
      ) as HTMLElement | null) ||
      (formRef.current.querySelector(
        `[data-field="${firstErrorKey}"]`,
      ) as HTMLElement | null) ||
      (document.getElementById(`field-${firstErrorKey}`) as HTMLElement | null);

    if (!field) return;

    field.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      field.focus();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      scrollToFirstError(newErrors);
      return;
    }
    setLoading(true);

    const payload = {
      userId: employeeId,
      role: formData.role,
      employmentType: formData.employmentType,
      probationPeriod: formData.probationPeriod,
      policyId: formData.payslipId,
      payslipId: formData.payslipId,
      salary: Number(formData.salary),
      assignments: [
        ...(formData.role === RoleEnum.MANAGER
          ? [
              {
                branchId: formData.branchId,
                shiftId: formData.shiftId,
                departmentId: formData.departmentId,
                designationId: formData.designationId,
                isReporting: true,
                remarks: "", //pass when edit only
              },
            ]
          : []),
        ...formData.assignments,
      ],
      remarks: "", //pass when edit only
    };

    const response = await assignRolesAndResponsibility(payload);
    if (response.success) {
      navigate(pathNames.ALL_EMPLOYEES);
      setFormData(initialEmployeeFormData);
    }
  };

  const handleClose = () => {
    navigate(pathNames.ONBOARDING_DETAILS, {
      state: location?.state,
    });
  };
  return (
    <>
      <TopBar
        title="Employee Details"
        actionButtons={
          <Button
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        }
      />
      <div className="content-area flex flex-col gap-4">
        <PageLoader loading={loading} />
        {employeeId ? (
          <form ref={formRef} method="POST" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-[5fr_3.5fr] gap-4">
              <div className="flex flex-col gap-3">
                <EmployeeDetailCard
                  data={employee}
                  branches={branches}
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
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
                {errors.employee_departmentId && (
                  <p className="mt-1 text-xs text-error">
                    {errors.employee_departmentId}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <PolicyDetailsCard
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
                <SalaryDetailsCard
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <Button type="submit" name="Save" size="sm" />
              <Button name="Cancel" variant="secondary" size="sm" />
            </div>
          </form>
        ) : (
          !loading && <EmptyPlaceholder title="Employee Not Found." />
        )}
      </div>
    </>
  );
};

export default AssignRolesResponsibility;
