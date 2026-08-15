import { useNavigate, useParams } from "react-router-dom";
import { pathNames } from "../../../../../constants/constants";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import { useEffect, useRef, useState } from "react";
import {
  assignRolesAndResponsibility,
  getBranchShiftDepartment,
  getEmployeeDetails,
} from "../../../../../apis/workforce/onboardings.api";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import EmployeeDetailCard from "./EmployeeDetailsCard";
import PageLoader from "../../../../common/loader/PageLoader";
import { IEmployee, IEmployeeDetails, initialEmployee, initialEmployeeDetails } from "../employee-details";
import { BranchTypeEnum, RoleEnum, statusEnum } from "../../../../../types/common-types";
import PolicyDetailsCard from "./PolicyDetails";
import SalaryDetailsCard from "./SalaryDetails";
import EmployeeAssignmentCard from "./EmployeeAssignmentCard";
import Modal from "../../../../common/modal/Modal";
import AddPolicy from "../../../organization/policy-configuration/add-policy/AddPolicy";
import Image from "../../../../common/image";
import UserImage from "../../../../../assets/images/User-Image.png";
import TextAreaField from "../../../../common/text-area/TextAreaField";
import Note from "../../../../common/note-area/Note";
import { useAuthStore } from "../../../../../store/auth-store";

export interface IManager {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
  status: statusEnum;
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

  isUan: boolean;
  isESIC: boolean;

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
  employee: IManager[];
  status: statusEnum;
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
  status: statusEnum;
}

export interface IBranch {
  _id: string;
  name: string;
  address: string;
  shifts: IShift[];
  count: number;
  status: statusEnum;
  branchType: BranchTypeEnum;
}

interface IConfirmationDetails {
  branch: string;
  shift: string;
  department: string;
  totalManaged: number;
  managerInfo: {
    profileImage: string;
    firstName: string;
    lastName: string;
  };
}

const AssignRolesResponsibility = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const employeeId = params?.id ?? "";

  const [employee, setEmployee] = useState<IEmployee>(initialEmployee);
    const [employeeDetails, setEmployeeDetails] = useState<IEmployeeDetails>(
      initialEmployeeDetails,
    );

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

    isESIC: false,
    isUan: false,

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
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [branches, setBranches] = useState<IBranch[]>([]);

  const [policyId, setPolicyId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const initialConfirmationDetails: IConfirmationDetails = {
    branch: "",
    shift: "",
    department: "",
    managerInfo: {
      profileImage: "",
      firstName: "",
      lastName: "",
    },
    totalManaged: 0,
  };
  const [confirmationDetails, setConfirmationDetails] =
    useState<IConfirmationDetails>(initialConfirmationDetails);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
      if (employeeId) {
        fetchEmployeeDetails();
      }
      // eslint-disable-next-line
    }, [employeeId]);
  
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      const response = await getEmployeeDetails(employeeId);
      if (response.success) {
        const data = response?.data;
        setEmployee(data?.user);
        setEmployeeDetails(data?.userDetails);
      } else {
        setEmployee(initialEmployee);
        setEmployeeDetails(initialEmployeeDetails);
      }
      setLoading(false);
    };

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
    if (formData.policyId === "") {
      newErrors.policyId = "Policy is required";
    }
    // Common fields

    if (!formData.payslipId) {
      newErrors.payslipId = "Payslip is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    }

    // Employee assignment
    if (formData.role === RoleEnum.EMPLOYEE) {
      if (!employeeAssignment?.departmentId) {
        newErrors.employee_departmentId = "Department is required";
      }
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
      await handleCancelConfirmation();
      scrollToFirstError(newErrors);
      return;
    }
    setSubmitting(true);

    const payload = {
      userId: employeeId,
      role: formData.role,
      employmentType: formData.employmentType,
      probationPeriod: formData.probationPeriod,
      policyId: formData.policyId,
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
      handleCancelConfirmation();
      navigate(pathNames.ALL_EMPLOYEES);
      setFormData(initialEmployeeFormData);
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    navigate(`${pathNames.ONBOARDING_DETAILS}/${employeeId}`);
  };

  const handleClickOnAction = () => {
    const newErrors = validate();
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      scrollToFirstError(newErrors);
      return;
    }
    if (formData.role === RoleEnum.MANAGER) {
      const branch = branches.find((item) => item._id === formData.branchId);
      const shift = branch?.shifts.find(
        (item) => item._id === formData.shiftId,
      );
      const department = shift?.departments.find(
        (item) => item._id === formData.departmentId,
      );
      const departments = formData.assignments.map((item) => {
        const branch = branches.find((branch) => branch._id === item.branchId);
        const shift = branch?.shifts.find(
          (shift) => shift._id === item.shiftId,
        );
        return shift?.departments?.find(
          (department) => department._id === item.departmentId,
        );
      });
      const count = departments?.reduce(
        (acc, curr) => acc + (curr?.count || 0),
        0,
      );
      setConfirmationDetails({
        branch: branch?.name || "",
        shift: shift?.name || "",
        department: department?.name || "",
        managerInfo: {
          profileImage:
            department?.manager?.profileImage || user?.profileImage || "",
          firstName: department?.manager?.firstName || user?.firstName || "",
          lastName: department?.manager?.lastName || user?.lastName || "",
        },
        totalManaged: count,
      });
    } else {
      const assignment = formData.assignments[0];
      const branch = branches.find((item) => item._id === assignment?.branchId);
      const shift = branch?.shifts.find(
        (item) => item._id === assignment?.shiftId,
      );
      const department = shift?.departments.find(
        (item) => item._id === assignment?.departmentId,
      );
      setConfirmationDetails({
        branch: branch?.name || "",
        shift: shift?.name || "",
        department: department?.name || "",
        managerInfo: {
          profileImage:
            department?.manager?.profileImage || user?.profileImage || "",
          firstName: department?.manager?.firstName || user?.firstName || "",
          lastName: department?.manager?.lastName || user?.lastName || "",
        },
        totalManaged: 0,
      });
    }
    setConfirmationOpen(true);
  };

  const handlePolicyOpenClose = (policyId: string = "") => {
    setPolicyId(policyId);
    setOpen((prev) => !prev);
  };

  const handleCancelConfirmation = () => {
    setConfirmationOpen(false);
    setConfirmationDetails(initialConfirmationDetails);
  };
  return (
    <>
      <TopBar
        title="Employee Details"
        actionButtons={
          <div className="flex gap-2">
            <Button name="Action" size="sm" onClick={handleClickOnAction} />
            <Button
              size="sm"
              variant={"danger"}
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
            />
          </div>
        }
      />
      <div className="content-area flex flex-col gap-4">
        <PageLoader loading={loading} />
        {employeeId ? (
          <form ref={formRef} method="POST" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-[5fr_3.5fr] gap-4">
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
                  handlePolicyOpenClose={handlePolicyOpenClose}
                />
                <SalaryDetailsCard
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  employeeDetails={employeeDetails}
                />
              </div>
            </div>
          </form>
        ) : (
          !loading && <EmptyPlaceholder title="Employee Not Found." />
        )}
      </div>
      <Modal
        isOpen={open}
        title={`${employee?.firstName} ${employee?.lastName}`}
        width="max-w-6xl"
        onClose={handlePolicyOpenClose}
        showFooter={false}
      >
        {open && (
          <AddPolicy
            editPolicyId={policyId}
            handleClosePolicy={handlePolicyOpenClose}
          />
        )}
      </Modal>

      <Modal
        isOpen={confirmationOpen}
        title={`${employee?.firstName} ${employee?.lastName}`}
        onClose={() => setConfirmationOpen(false)}
        handleOnConfirm={() => formRef.current?.requestSubmit()}
        loading={submitting}
      >
        <>
          <div className="mb-4 flex flex-col items-center gap-2 text-center">
            <Image
              src={employee?.profileImage}
              fallbackSrc={UserImage}
              alt="employee"
              width={80}
            />

            <h3 className="text-lg font-medium">
              {`Are u sure want to active this employee ?`}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="space-y-3 text-[14px]">
              <div className="border border-dashed border-[#c0cbf7] bg-[#fff6f9] px-6 py-3">
                <h3 className="mb-2 text-center text-[14px] font-semibold text-gray-800">
                  Reporting To:
                </h3>

                <div className="flex items-center justify-center">
                  <div className="px-5 font-medium text-gray-800 border-r border-[#97a7cd]">
                    {confirmationDetails.branch}
                  </div>

                  <div className="px-5 font-medium text-gray-800 border-r border-[#97a7cd]">
                    {confirmationDetails.shift}
                  </div>

                  <div className="px-5 font-medium text-gray-800 border-r border-[#97a7cd]">
                    {confirmationDetails.department}
                  </div>

                  <div className="px-5 flex items-center gap-2 font-medium text-gray-800">
                    <Image
                      src={confirmationDetails.managerInfo.profileImage}
                      fallbackSrc={UserImage}
                      alt="Manager"
                      width={40}
                      height={40}
                    />
                    <span>{`${confirmationDetails.managerInfo.firstName} ${confirmationDetails.managerInfo.lastName}`}</span>
                  </div>
                </div>
              </div>
              {formData?.role === RoleEnum.MANAGER && (
                <div className="flex items-center justify-center bg-primaryBlur py-2">
                  <span className="font-semibold text-sm text-gray-800">
                    Total People Managed
                  </span>

                  <span className="ml-3 inline-flex h-9 min-w-[40px] text-sm items-center justify-center bg-primary px-3 font-semibold text-white">
                    {confirmationDetails.totalManaged}
                  </span>
                </div>
              )}
              <TextAreaField
                label="Remarks"
                name={"remarks"}
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
              />
              <Note
                variant="danger"
                message={
                  "After active this employee all rights of this employee are accessible."
                }
              />
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default AssignRolesResponsibility;
