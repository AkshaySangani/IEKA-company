import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { pathNames } from "../../../../../constants/constants";

import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import EmployeeDetailCard from "./EmployeeDetailsCard";
import PageLoader from "../../../../common/loader/PageLoader";
import EmployeeOtherDetails from "./EmployeeOtherDetails";

import {
  getEmployeeById,
} from "../../../../../apis/workforce/all-employee.api";

import {
  BloodGroupEnum,
  EmploymentTypeEnum,
  GenderEnum,
  RoleEnum,
  statusEnum,
} from "../../../../../types/common-types";

/* =========================
   TYPES
========================= */

export interface IBaseEntity {
  _id: string;
  name: string;
}

export interface IShift extends IBaseEntity {
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
}

export interface IEmployee {
  _id: string;
  role: RoleEnum;

  firstName: string;
  lastName: string;
  email: string;
  phone: number;

  gender: GenderEnum;
  profileImage: string;

  address: string;
  permanentAddress: string;

  status: statusEnum;

  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;

  companyId: string;
  branchId: string;
  departmentId: string;
  designationId: string;
  shiftId: string;

  dob: string;
  isMarried: boolean;
  alternatePhone: number;
  bloodGroup: BloodGroupEnum;
  isPhysicallyDisabled: boolean;

  employmentType: EmploymentTypeEnum;
  probationPeriod: number;

  createdAt: string;
  updatedAt: string;
}

export interface IAssignment {
  branchId: IBaseEntity;
  shiftId: IShift;
  departmentId: IBaseEntity;
  designationId: IBaseEntity;

  reportingManagerId: string | null;

  isReporting: boolean;
  joinedAt: string;
  assignedBy: string;
  remarks: string;
}

export interface IAssignmentContainer {
  _id: string;
  userId: string;
  companyId: string;

  assignments: IAssignment[];

  createdAt: string;
  updatedAt: string;
}

export interface IPolicy {
  _id: string;
  userId: string;
  policyId: {
    name: string;
    _id: string;
  };
  remarks: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayslip {
  _id: string;
  userId: string;
  salary: number;
  payslipId: string;
  remarks: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeResponse {
  user: IEmployee;
  assignments: IAssignmentContainer;
  policy: IPolicy;
  payslip: IPayslip;
}

/* =========================
   INITIAL VALUES
========================= */

export const initialEmployee: IEmployee = {
  _id: "",

  role: RoleEnum.EMPLOYEE,

  firstName: "",
  lastName: "",
  email: "",
  phone: 0,

  gender: GenderEnum.MALE,
  profileImage: "",

  address: "",
  permanentAddress: "",

  status: statusEnum.PENDING,

  lastLoginAt: null,
  passwordChangedAt: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,

  companyId: "",
  branchId: "",
  departmentId: "",
  designationId: "",
  shiftId: "",

  dob: "",

  isMarried: false,
  alternatePhone: 0,

  bloodGroup: BloodGroupEnum.A_POSITIVE,
  isPhysicallyDisabled: false,

  employmentType: EmploymentTypeEnum.INTERN,
  probationPeriod: 0,

  createdAt: "",
  updatedAt: "",
};

export const initialEmployeeResponse: IEmployeeResponse = {
  user: initialEmployee,

  assignments: {
    _id: "",
    userId: "",
    companyId: "",
    assignments: [],
    createdAt: "",
    updatedAt: "",
  },

  policy: {
    _id: "",
    userId: "",
    policyId: {
      name: "",
      _id: ""
    },
    remarks: "",
    assignedBy: "",
    createdAt: "",
    updatedAt: "",
  },

  payslip: {
    _id: "",
    userId: "",
    salary: 0,
    payslipId: "",
    remarks: "",
    assignedBy: "",
    createdAt: "",
    updatedAt: "",
  },
};

/* =========================
   COMPONENT
========================= */

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const employeeId = location?.state?.employeeId;

  const [loading, setLoading] = useState(false);

  const [employeeData, setEmployeeData] =
    useState<IEmployeeResponse>(
      initialEmployeeResponse,
    );

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }

    // eslint-disable-next-line
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);

      const response = await getEmployeeById(
        employeeId,
      );

      if (response.success) {
        setEmployeeData(response.data);
      } else {
        setEmployeeData(
          initialEmployeeResponse,
        );
      }
    } catch (error) {
      console.log(error);

      setEmployeeData(
        initialEmployeeResponse,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(pathNames.ALL_EMPLOYEES) ;
  };

  const currentAssignment =
    employeeData.assignments.assignments?.[0];

  return (
    <>
      <TopBar
        title="Employee Details"
        actionButtons={
          <Button
            size="sm"
            variant="danger"
            onClick={handleClose}
            leftIcon={
              <i className="fa-solid fa-xmark fa-xl text-danger" />
            }
          />
        }
      />

      <div className="content-area flex flex-col gap-4">
        <PageLoader loading={loading} />

        {!loading && employeeId ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[4fr_3fr]">
            <EmployeeDetailCard
              employeeData={employeeData.user}
              assignments={employeeData.assignments.assignments}
              policy={
                employeeData.policy
              }
              payslip={employeeData.payslip}
              refreshData={fetchEmployeeDetails}
            />

            <EmployeeOtherDetails />
          </div>
        ) : (
          !loading && (
            <EmptyPlaceholder title="Employee Not Found." />
          )
        )}
      </div>
    </>
  );
};

export default EmployeeDetails;