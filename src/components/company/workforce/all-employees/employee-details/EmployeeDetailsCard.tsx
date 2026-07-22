import React, { useState } from "react";
import Image from "../../../../common/image";
import {
  currency,
  employmentType,
  roleNames,
  statusMessage,
} from "../../../../../constants/constants";
import { IAssignment, IEmployee, IPayslip, IPolicy } from ".";
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

interface Props {
  employeeData: IEmployee;
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

const EmployeeDetailCard: React.FC<Props> = ({ employeeData,assignments,policy,payslip,refreshData }) => {
  const isManager = employeeData.role === RoleEnum.MANAGER;
  const designation = assignments?.length > 0 ? assignments[0]?.designationId: {name: "",_id: ""};
  const manageBranch = assignments.find(ele => !ele.isReporting);
  const reportingBranch = isManager ? assignments.find(ele => ele.isReporting) : assignments[0];
  const [update, setUpdate] = useState<EmployeeUpdateModal | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    const response = await assignRolesAndResponsibility({userId: employeeData._id,...payload});
    if(response.success){
      setUpdate("");
      refreshData();
    }
    setLoading(false);
  }
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

          <h2 className="text-lg text-white font-semibold">
            {employeeData.firstName} {employeeData.lastName}
          </h2>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <i className="fa-solid fa-user-pen text-secondary"></i>
            <h3 className="text-md text-gray-600 font-semibold">
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
            <h3 className="text-md text-gray-600 font-semibold">
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

            {employeeData.role === RoleEnum.MANAGER && <DetailRow
              label="Managed Branch & Departments"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{manageBranch?.branchId?.name}</span>
                  <i onClick={() => setUpdate(EmployeeUpdateModal.MANAGE_BRANCH)} className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"></i>
                </div>
              }
            />}

            <DetailRow
              label="Reporting Branch & Shift"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{reportingBranch?.branchId.name}</span>
                  <i onClick={() => setUpdate(EmployeeUpdateModal.REPORTING_BRANCH)} className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"></i>
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
                  <span>{employeeData.probationPeriod}{` Month${employeeData.probationPeriod>1 ?"s":""}`}</span>
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
                  <span>{policy.policyId?.name}</span>
                  <i onClick={() =>
                      setUpdate(EmployeeUpdateModal.POLICY)
                    } className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"></i>
                </div>
              }
            />

            <DetailRow
              label="Salary Details"
              value={
                <div className="flex items-center gap-2 mr-1">
                  <span>{currency.INR}{" "}{payslip.salary}</span>
                  <i onClick={() =>
                      setUpdate(EmployeeUpdateModal.SALARY)
                    } className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-secondary"></i>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <StatusUpdate
        active={update === EmployeeUpdateModal.STATUS}
        employeeName={`${employeeData?.firstName} ${employeeData?.lastName}`}
        profileImage={employeeData?.profileImage}
        setActive={() => setUpdate("")}
        status={employeeData?.status}
        refreshData={() => {}}
      />
      <DesignationUpdate
        active={update === EmployeeUpdateModal.DESIGNATION}
        employeeName={`${employeeData?.firstName} ${employeeData?.lastName}`}
        profileImage={employeeData?.profileImage}
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
        status={employeeData?.status}
        refreshData={() => {}}
      />
      <ProbationPeriodUpdate
        active={update === EmployeeUpdateModal.PROBATION_PERIOD}
        employeeName={`${employeeData?.firstName} ${employeeData?.lastName}`}
        profileImage={employeeData?.profileImage}
        setActive={() => setUpdate("")}
        status={employeeData?.status}
        refreshData={() => {}}
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
        payslip={payslip}
        setActive={() => setUpdate("")}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <BranchAssignmentUpdate 
        active={update === EmployeeUpdateModal.REPORTING_BRANCH || update === EmployeeUpdateModal.MANAGE_BRANCH}
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
