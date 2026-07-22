import React, { useEffect, useState } from "react";
import { IOption, salaryType, statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { IEmployee, IPayslip } from "..";
import MonthPicker, { MonthPickerValue } from "../../../../../common/date-picker/MonthPicker";
import { getEarnings } from "../../../../../../apis/pay-slip/earnings.api";
import { calculateSalaryBreakdown } from "../../../../../../utils/helper";
import { IEarning } from "../../../../pay-slip/earnings";
import { getDeductions } from "../../../../../../apis/pay-slip/deductions.api";
import { IDeductionDetail, ISalaryDetail } from "../../../onboarding/assign-roles-responsibility/SalaryDetails";
import TextField from "../../../../../common/text-field/TextField";

interface SalaryUpdateProps {
  active: boolean;
  employeeData: IEmployee;
  payslip: IPayslip;
  setActive: (value: boolean) => void;
  handleSubmit: (payload: any) => void;
  loading: boolean;
}

interface SalaryFormData {
  payslipId: string;
  remarks: string;
  salary: number;
  month: number;
  year: number;
}
export default function SalaryUpdate({
  active,
  employeeData,
  payslip,
  setActive,
  handleSubmit,
  loading
}: SalaryUpdateProps) {
  const initialFormData: SalaryFormData = {
    payslipId: payslip.payslipId,
    salary: payslip.salary,
    remarks: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  const [formData, setFormData] = useState<SalaryFormData>(initialFormData);

  const [payslips, setPayslips] = useState<IEarning[]>([]);
  const [salaryDetails, setSalaryDetails] = useState<ISalaryDetail[]>([]);
  const [deductionDetails, setDeductionDetails] = useState<IDeductionDetail[]>([]);
  
  useEffect(() => {
    if (active) {
      fetchPayslips();
      fetchDeductions();
    //   setFormData(prev => ({...prev, policyId: policy.policyId._id}))
    }
  }, [active]);

  const fetchPayslips = async () => {
    const response = await getEarnings({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setPayslips(
        response?.data?.payslips
      );
      const details = response?.data?.payslips.find((ele: IEarning) => ele?._id === payslip.payslipId)?.details;
          if (details) {
            setSalaryDetails(
              [...details]?.map((ele: any) => ({ ...ele, type: salaryType.EARNING })),
            );
          } else setSalaryDetails([]);
    } else {
      setPayslips([]);
    }
  };

  const fetchDeductions = async () => {
      const response = await getDeductions();
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

  const handleChange = (field: keyof SalaryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnSubmit = async () => {
    await handleSubmit(formData);
  }
  const { earnings, deductions, grossSalary, netSalary } =
      calculateSalaryBreakdown(formData.salary, [
        ...salaryDetails,
        ...deductionDetails,
      ]);

  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData.lastName}`}
      width="max-w-2xl"
      onClose={() => setActive(false)}
      handleOnConfirm={handleOnSubmit}
      loading={loading}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={employeeData.profileImage}
          title="Are u sure want to update salary of this employee ?"
        />
        <form method="POST" className="grid grid-cols-1 gap-4">
          <TextField
            label="Salary/ Month"
            name="salary"
            required
            value={formData.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            // error={errors.salary}
          />
          {formData.payslipId && <div className="grid grid-cols-[3fr_2fr]">
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
          </div>}
          <MonthPicker value={{month: formData.month, year: formData.year}} label="Effective From month" onChange={(value: MonthPickerValue) => {
            setFormData(prev => ({...prev, ...value}))
          }} />
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
