import React, { useState } from "react";
import Image from "../../../../common/image";
import {
  currency,
  employmentType,
  roleNames,
} from "../../../../../constants/constants";
import {
  IAssignment,
  IBaseEntity,
  IEmployee,
  IPayslip,
  IPolicy,
  IShift,
} from ".";
import { formatDate } from "../../../../../utils/date-format";
import DetailRow from "../../../../common/detail-row";
import StatusUpdate from "./update-modals/StatusUpdate";
import StatusBadge from "../../../../common/badge/StatusBadge";
import DesignationUpdate from "./update-modals/DesignationUpdate";
import EmploymentTypeUpdate from "./update-modals/EmploymentTypeUpdate";
import ProbationPeriodUpdate from "./update-modals/ProbationPeriodUpdate";
import BranchAssignmentUpdate from "./update-modals/BranchAssignmentUpdate";
import { assignRolesAndResponsibility } from "../../../../../apis/workforce/onboardings.api";
import { RoleEnum } from "../../../../../types/common-types";
import PolicyUpdate from "./update-modals/PolicyUpdate";
import SalaryUpdate from "./update-modals/SalaryUpdate";
import BranchDepartmentCards from "./BranchDepartments";
import { IEmployeeDetails } from "../../onboarding/employee-details";

interface Props {
  employeeData: IEmployee;
  employeeDetails: IEmployeeDetails;
  assignments: IAssignment[];
  policy: IPolicy;
  payslip: IPayslip;
  refreshData: () => void;
}

export enum EmployeeUpdateModal {
  STATUS = "status",
  DESIGNATION = "designation",
  EMPLOYMENT_TYPE = "employmentType",
  PROBATION_PERIOD = "probationPeriod",
  REPORTING_BRANCH = "EMPLOYEE",
  MANAGE_BRANCH = "MANAGER",
  POLICY = "Policy",
  SALARY = "Salary",
}

const EmployeeDetailCard: React.FC<Props> = ({
  employeeData,
  employeeDetails,
  assignments,
  policy,
  payslip,
  refreshData,
}) => {
  const isManager = employeeData.role === RoleEnum.MANAGER;
  const designation =
    assignments?.length > 0
      ? assignments[0]?.designationId
      : { name: "", _id: "" };
  const manageBranches = assignments.filter((ele) => !ele.isReporting);
  const reportingBranch = isManager
    ? assignments.find((ele) => ele.isReporting)
    : assignments[0];
  const [update, setUpdate] = useState<EmployeeUpdateModal | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    const response = await assignRolesAndResponsibility({
      userId: employeeData._id,
      ...payload,
    });
    if (response.success) {
      setUpdate("");
      refreshData();
    }
    setLoading(false);
  };

  const getBranches = (branches: IAssignment[]) => {
    const groupedAssignments = branches.reduce(
      (acc, assignment) => {
        const key = `${assignment.branchId._id}-${assignment.shiftId._id}`;

        if (!acc[key]) {
          acc[key] = {
            branch: assignment.branchId,
            shift: assignment.shiftId,
            departments: [],
          };
        }

        // Prevent duplicate departments
        if (
          !acc[key].departments.some(
            (d) => d._id === assignment.departmentId._id,
          )
        ) {
          acc[key].departments.push(assignment.departmentId);
        }

        return acc;
      },
      {} as Record<
        string,
        {
          branch: IBaseEntity;
          shift: IShift;
          departments: IBaseEntity[];
        }
      >,
    );
    return Object.values(groupedAssignments);
  };

  const cards = manageBranches?.length > 0 ? getBranches(manageBranches) : [];
  const reportingCards = reportingBranch ? getBranches([reportingBranch]) : [];
  return (
    <>
      <div className="content-card bg-white border border-gray-200">
        {/* Header */}
        <div className="bg-primary p-2.5 flex items-center gap-4">
          <div className="w-[100px] bg-white flex items-center justify-center">
            <Image
              src={employeeData.profileImage}
              alt={employeeData.firstName}
              className="max-h-16 object-contain"
            />
          </div>

          <h2 className="text-lg text-white font-medium">
            {employeeData.firstName} {employeeData.lastName}
          </h2>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <i className="fa-solid fa-user-pen text-secondary"></i>
            <h3 className="text-md text-gray-600 font-medium">
              Employee Configuration
            </h3>
          </div>
          <div className="space-y-4">
            <DetailRow
              label="Employee Full Name"
              value={
                <>
                  {employeeData.firstName} {employeeData.lastName}
                </>
              }
            />
            <DetailRow
              label="Created Date"
              value={formatDate(employeeData.createdAt)}
            />

            <DetailRow
              label="Status"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <StatusBadge status={employeeData.status} />
                  <i
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                    onClick={() => setUpdate(EmployeeUpdateModal.STATUS)}
                  ></i>
                </div>
              }
            />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <i className="fa-solid fa-user-gear"></i>
            <h3 className="text-md text-gray-600 font-medium">
              Employment Details
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Organizational Role"
              value={roleNames[employeeData.role]}
            />

            <DetailRow
              label="Designation"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{designation.name}</span>
                  <i
                    onClick={() => setUpdate(EmployeeUpdateModal.DESIGNATION)}
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />

            {employeeData.role === RoleEnum.MANAGER && (
              <DetailRow
                label="Managed Branch & Departments"
                value={
                  <div className="flex items-center gap-2 mr-1">
                    <BranchDepartmentCards cards={cards} />
                    <i
                      onClick={() =>
                        setUpdate(EmployeeUpdateModal.MANAGE_BRANCH)
                      }
                      className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                    ></i>
                  </div>
                }
              />
            )}

            <DetailRow
              label="Reporting Branch & Shift"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <BranchDepartmentCards cards={reportingCards} />
                  <i
                    onClick={() =>
                      setUpdate(EmployeeUpdateModal.REPORTING_BRANCH)
                    }
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />

            <DetailRow
              label="Employment Type"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{employmentType[employeeData.employmentType]}</span>
                  <i
                    onClick={() =>
                      setUpdate(EmployeeUpdateModal.EMPLOYMENT_TYPE)
                    }
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />

            <DetailRow
              label="Probational Period"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>
                    {employeeData.probationPeriod}
                    {` Month${employeeData.probationPeriod > 1 ? "s" : ""}`}
                  </span>
                  <i
                    onClick={() =>
                      setUpdate(EmployeeUpdateModal.PROBATION_PERIOD)
                    }
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />

            <DetailRow
              label="Policy Applied"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{policy?.policyId?.name}</span>
                  <i
                    onClick={() => setUpdate(EmployeeUpdateModal.POLICY)}
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />

            <DetailRow
              label="Salary Details"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>
                    {currency.INR} {payslip.salary}
                  </span>
                  <i
                    onClick={() => setUpdate(EmployeeUpdateModal.SALARY)}
                    className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"
                  ></i>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <StatusUpdate
        active={update === EmployeeUpdateModal.STATUS}
        employeeData={employeeData}
        setActive={() => setUpdate("")}
        status={employeeData?.status}
        refreshData={refreshData}
      />
      <DesignationUpdate
        active={update === EmployeeUpdateModal.DESIGNATION}
        employeeData={employeeData}
        assignments={assignments}
        setActive={() => setUpdate("")}
        designationId={designation?._id}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <EmploymentTypeUpdate
        active={update === EmployeeUpdateModal.EMPLOYMENT_TYPE}
        employeeName={`${employeeData?.firstName} ${employeeData?.lastName}`}
        profileImage={employeeData?.profileImage}
        setActive={() => setUpdate("")}
        employmentType={employeeData?.employmentType}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <ProbationPeriodUpdate
        active={update === EmployeeUpdateModal.PROBATION_PERIOD}
        employeeName={`${employeeData?.firstName} ${employeeData?.lastName}`}
        profileImage={employeeData?.profileImage}
        setActive={() => setUpdate("")}
        probationPeriod={employeeData?.probationPeriod}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      <PolicyUpdate
        active={update === EmployeeUpdateModal.POLICY}
        employeeData={employeeData}
        policy={policy}
        setActive={() => setUpdate("")}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <SalaryUpdate
        active={update === EmployeeUpdateModal.SALARY}
        employeeData={employeeData}
        employeeDetails={employeeDetails}
        payslip={payslip}
        setActive={() => setUpdate("")}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <BranchAssignmentUpdate
        active={
          update === EmployeeUpdateModal.REPORTING_BRANCH ||
          update === EmployeeUpdateModal.MANAGE_BRANCH
        }
        role={update}
        employeeData={employeeData}
        assignments={assignments}
        setActive={() => setUpdate("")}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default EmployeeDetailCard;
