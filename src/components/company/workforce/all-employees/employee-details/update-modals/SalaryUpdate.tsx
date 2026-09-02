import React, { useEffect, useState } from "react";
import {
  IOption,
  salaryType,
  statusEnum,
} from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { IEmployee, IPayslip } from "..";
import MonthPicker, {
  MonthPickerValue,
} from "../../../../../common/date-picker/MonthPicker";
import { getEarnings } from "../../../../../../apis/pay-slip/earnings.api";
import { calculateSalaryBreakdown } from "../../../../../../utils/helper";
import { IEarning } from "../../../../pay-slip/earnings";
import { getDeductions } from "../../../../../../apis/pay-slip/deductions.api";
import {
  IDeductionDetail,
  ISalaryDetail,
} from "../../../onboarding/assign-roles-responsibility/SalaryDetails";
import TextField from "../../../../../common/text-field/TextField";
import Checkbox from "../../../../../common/checkbox/CheckBox";
import { IEmployeeDetails } from "../../../onboarding/employee-details";
import {
  getEmployeeSalary,
  IEmployeeSalaryPayload,
  updateEmployeeSalary,
} from "../../../../../../apis/workforce/all-employee.api";
import { ApiResponse } from "../../../../../../types/api.types";
import PageLoader from "../../../../../common/loader/PageLoader";
import SelectField from "../../../../../common/select/SelectField";

interface SalaryUpdateProps {
  active: boolean;
  employeeData: IEmployee;
  employeeDetails: IEmployeeDetails;
  payslip: IPayslip;
  setActive: (value: boolean) => void;
  refreshData: () => void;
  loading: boolean;
}

interface SalaryFormData {
  payslipId: string;
  remarks: string;
  salary: number;
  month: number;
  year: number;
  allowESICDeduction: boolean;
  allowPFDeduction: boolean;
}

export type SalaryDetailValueType = "PERCENTAGE" | "FIXED";

export type PayslipStatus = "ACTIVE" | "INACTIVE";

export interface IPayslipDetail {
  name: string;
  value: number;
  valueType: SalaryDetailValueType;
  _id: string;
}

interface IPayslipId {
  _id: string;
  companyId: string;
  name: string;
  status: PayslipStatus;
  details: IPayslipDetail[];
  createdAt: string;
  updatedAt: string;
}

interface IEmployeeSalary {
  _id: string;
  userId: string;
  salary: number;
  payslipId: IPayslipId;
  remarks: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  allowESICDeduction: boolean;
  allowPFDeduction: boolean;
  effectiveFromMonth: number;
  effectiveFromYear: number;
}
const today = new Date();
const minMonth: MonthPickerValue = {
  month: today.getMonth(),
  year: today.getFullYear(),
};

export default function SalaryUpdate({
  active,
  employeeData,
  employeeDetails,
  payslip,
  setActive,
  refreshData,
}: SalaryUpdateProps) {
  // initialize formdata for salary
  const initialFormData: SalaryFormData = {
    payslipId: payslip.payslipId,
    salary: 0,
    remarks: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    allowESICDeduction: payslip.allowESICDeduction,
    allowPFDeduction: payslip.allowPFDeduction,
  };
  const [formData, setFormData] = useState<SalaryFormData>(initialFormData);

  // initialize error
  interface SalaryFormErrors {
    salary?: string;
    month?: string;
    payslipId?: string;
  }

  const [errors, setErrors] = useState<SalaryFormErrors>({});

  const [salaryDetails, setSalaryDetails] = useState<ISalaryDetail[]>([]);
  const [deductionDetails, setDeductionDetails] = useState<IDeductionDetail[]>(
    [],
  );

  const [paySlipOptions, setPaySlipOptions] = useState<IOption[]>([]);

  const [currentSalary, setCurrentSalary] = useState<IEmployeeSalary | null>(
    null,
  );

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (active) {
      fetchSalaryData();
    }
    // eslint-disable-next-line
  }, [active]);

  const fetchSalaryData = async () => {
    setLoading(true);
    const [employeeSalary, salaryResponse, deductionResponse] =
      await Promise.all([
        getEmployeeSalary(employeeData._id),
        getEarnings({
          page: 1,
          limit: 200,
          status: statusEnum.ACTIVE,
        }),
        getDeductions(),
      ]);
    setEmployeeSalaryData(employeeSalary);
    fetchPayslips(salaryResponse);
    fetchDeductions(deductionResponse);
    setLoading(false);
  };

  const setEmployeeSalaryData = (response: ApiResponse) => {
    if (response.success) {
      const currentSalaryData = response?.data?.current;
      const upcomingSalaryData = response?.data?.upcoming;
      if (upcomingSalaryData) {
        setFormData((prev) => ({
          ...prev,
          salary: upcomingSalaryData.salary,
          month: upcomingSalaryData.effectiveFromMonth,
          year: upcomingSalaryData.effectiveFromYear,
          allowESICDeduction: upcomingSalaryData.allowESICDeduction,
          allowPFDeduction: upcomingSalaryData.allowPFDeduction,
        }));
      }
      if (currentSalaryData) {
        setCurrentSalary(currentSalaryData);
      }
    } else {
      setCurrentSalary(null);
    }
  };

  const fetchPayslips = async (response: ApiResponse) => {
    if (response.success) {
      const details = response?.data?.payslips.find(
        (ele: IEarning) => ele?._id === payslip.payslipId,
      )?.details;
      if (details) {
        setSalaryDetails(
          [...details]?.map((ele: any) => ({
            ...ele,
            type: salaryType.EARNING,
          })),
        );
        setPaySlipOptions(
          response?.data?.payslips?.map((ele: IEarning) => ({
            label: ele.name,
            value: ele._id,
          })),
        );
      } else {
        setSalaryDetails([]);
        setPaySlipOptions([]) 
      };
    }
  };

  const fetchDeductions = async (response: ApiResponse) => {
    if (response.success) {
      setDeductionDetails(
        response?.data?.details?.map((ele: any) => ({
          ...ele,
          type: salaryType.DEDUCTION,
        })),
      );
    } else {
      setDeductionDetails([]);
    }
  };

  const handleChange = (
    field: keyof SalaryFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof SalaryFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: SalaryFormErrors = {};

    if (
      formData.salary === undefined ||
      formData.salary === null ||
      Number.isNaN(Number(formData.salary)) ||
      Number(formData.salary) <= 0
    ) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!formData.payslipId) {
      newErrors.payslipId = "Payslip earning is required";
    }

    if (!formData.month && formData.month !== 0) {
      newErrors.month = "Effective month is required";
    }

    if (!formData.year) {
      newErrors.month = "Effective month is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const payload: IEmployeeSalaryPayload = {
      userId: employeeData._id,
      salary: formData.salary,
      effectiveFromMonth: formData.month,
      effectiveFromYear: formData.year,
      remarks: formData.remarks,
      allowPFDeduction: formData.allowPFDeduction,
      allowESICDeduction: formData.allowESICDeduction,
    };
    const response = await updateEmployeeSalary(payload);
    if (response.success) {
      refreshData();
      setActive(false);
    }
    setLoading(false);
  };
  const { earnings, deductions, grossSalary, netSalary } =
    calculateSalaryBreakdown(
      formData.salary,
      [...salaryDetails, ...deductionDetails],
      formData.allowPFDeduction,
      formData.allowESICDeduction,
    );

  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData.lastName}`}
      width="max-w-2xl"
      onClose={() => setActive(false)}
      handleOnConfirm={handleOnSubmit}
      loading={loading}
    >
      <div className="flex flex-col gap-2 relative">
        <PageLoader loading={loading} />
        <ConfirmationHeader
          imageUrl={employeeData.profileImage}
          title="Are u sure want to update salary of this employee ?"
        />
        <form method="POST" className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TextField
              label="Current Salary/ Month"
              name="salary"
              disabled
              value={currentSalary?.salary}
            />
            <TextField
              label="Salary/ Month"
              name="salary"
              required
              value={formData.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              error={errors.salary}
            />
            <SelectField
              label="Payslip Earnings"
              required
              value={
                formData.payslipId
                  ? (paySlipOptions.find(
                      (ele) => ele.value === formData.payslipId,
                    ) ?? "")
                  : ""
              }
              options={paySlipOptions}
              name={"payslipId"}
              error={errors.payslipId}
              isMenuPortalTarget={false}
              onChange={(option) => handleChange("payslipId",option.value)}
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-2">
            {employeeDetails.bank.uanNo && (
              <div className="flex flex-col gap-2">
                <Checkbox
                  name={"allowPFDeduction"}
                  label="UAN No."
                  checked={formData.allowPFDeduction}
                  onChange={() =>
                    handleChange("allowPFDeduction", !formData.allowPFDeduction)
                  }
                />
                <TextField
                  label=""
                  name=""
                  required
                  value={employeeDetails.bank.uanNo}
                  disabled
                />
              </div>
            )}
            {employeeDetails.bank.esicNo && (
              <div className="flex flex-col gap-2">
                <Checkbox
                  name={"allowESICDeduction"}
                  label="ESIC No."
                  checked={formData.allowESICDeduction}
                  onChange={() =>
                    handleChange(
                      "allowESICDeduction",
                      !formData.allowESICDeduction,
                    )
                  }
                />
                <TextField
                  label=""
                  name=""
                  required
                  value={employeeDetails.bank.esicNo}
                  disabled
                />
              </div>
            )}
          </div>
          {formData.payslipId && (
            <div className="grid grid-cols-[3fr_2fr]">
              <div className="border p-2 font-bold">{"Component"}</div>
              <div className="border p-2 font-bold">{"Amount (₹)"}</div>
              {earnings?.map((salary, index) => (
                <React.Fragment key={index}>
                  <div className="border p-2">{salary.name}</div>
                  <div className="border p-2">₹{salary.amount}</div>
                </React.Fragment>
              ))}
              <div className="border p-2 font-bold">{"Gross Salary"}</div>
              <div className="border p-2 font-bold">₹{grossSalary}</div>
              {deductions?.map((deduction, index) => (
                <React.Fragment key={index}>
                  <div className="border p-2">{deduction.name}</div>
                  <div className="border p-2">-₹{deduction.amount}</div>
                </React.Fragment>
              ))}
              <div className="border p-2 font-bold">{"Net Salary"}</div>
              <div className="border p-2 font-bold">₹{netSalary}</div>
            </div>
          )}
          <MonthPicker
            required
            value={{ month: formData.month, year: formData.year }}
            label="Effective From month"
            onChange={(value: MonthPickerValue) => {
              setFormData((prev) => ({ ...prev, ...value }));
            }}
            minDate={minMonth}
            error={errors.month}
          />
          <TextAreaField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            placeholder="Enter remarks..."
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </form>
      </div>
    </Modal>
  );
}
