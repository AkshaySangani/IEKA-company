import React, { useEffect, useState } from "react";
import { statusEnum } from "../../../../../constants/constants";
import SelectField from "../../../../common/select/SelectField";
import { IEmployeeFormData } from ".";
import {
  IOption,
  salaryType,
  ValueType,
} from "../../../../../types/common-types";
import TextField from "../../../../common/text-field/TextField";
import { Building } from "lucide-react";
import { getEarnings } from "../../../../../apis/pay-slip/earnings.api";
import { IEarning } from "../../../pay-slip/earnings";
import { getDeductions } from "../../../../../apis/pay-slip/deductions.api";
import { calculateSalaryBreakdown } from "../../../../../utils/helper";

interface Props {
  formData: IEmployeeFormData;
  errors: any;
  handleChange: (key: keyof IEmployeeFormData, value: any) => void;
}

export interface ISalaryDetail {
  name: string;
  value: number;
  valueType: ValueType;
  type: salaryType;
  _id: string;
}

interface IDeductionDetail {
  name: string;
  value: number;
  valueType: ValueType;
  type: salaryType;
  _id: string;
}

const SalaryDetailsCard: React.FC<Props> = ({
  formData,
  errors,
  handleChange,
}) => {
  const [paySlips, setPaySlips] = useState<IEarning[]>([]);
  const [paySlipOptions, setPaySlipOptions] = useState<IOption[]>([]);
  const [salaryDetails, setSalaryDetails] = useState<ISalaryDetail[]>([]);
  const [deductionDetails, setDeductionDetails] = useState<IDeductionDetail[]>(
    [],
  );

  useEffect(() => {
    fetchPayslips();
    fetchDeductions();
    // eslint-disable-next-line
  }, []);

  //   useEffect(() => {
  //     if(salaryDetails?.length > 0 || deductions?.length > 0){
  //         const combinedData = [...salaryDetails,...deductions]

  //         console.log("data", data)
  //     }
  //   },[salaryDetails, deductions, formData.salary])

  const fetchPayslips = async () => {
    const response = await getEarnings({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setPaySlips(response?.data?.payslips);
      setPaySlipOptions(
        response?.data?.payslips?.map((ele: IEarning) => ({
          label: ele.name,
          value: ele._id,
        })),
      );
    } else {
      setPaySlips([]);
      setPaySlipOptions([]);
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

  const handleSelectSalary = (salaryId: string) => {
    const details = paySlips.find((ele) => ele?._id === salaryId)?.details;
    if (details) {
      setSalaryDetails(
        [...details]?.map((ele: any) => ({ ...ele, type: salaryType.EARNING })),
      );
    } else setSalaryDetails([]);
    handleChange("payslipId", salaryId);
  };

  const { earnings, deductions, grossSalary, netSalary } =
    calculateSalaryBreakdown(formData.salary, [
      ...salaryDetails,
      ...deductionDetails,
    ]);
  return (
    <div className="content-card bg-white border border-gray-200">
      <div className="p-5">
        <div className="flex items-center gap-2 border-b pb-3 mb-4">
          <div className="fa-solid fa-building-shield px-1.5 py-1.5 text-base bg-[#212936] text-white h-7.5 w-7.5 flex items-center justify-center">
            {" "}
            <Building />
          </div>
          <h3 className="text-md text-gray-600 font-semibold">
            Policy Details
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
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
            onChange={(option) => handleSelectSalary(option.value)}
          />
          <TextField
            label="Salary/ Month"
            name="salary"
            required
            value={formData.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
            error={errors.salary}
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
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailsCard;
