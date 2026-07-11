import { useEffect, useRef, useState } from "react";
import { ValueType } from "../../../../types/common-types";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import DeductionDetails from "./DeductionDetails";
import Button from "../../../common/button/Button";
import IncomeTaxDeductionDetails from "./IncomeTaxDeductionDetails";
import { addDeductions, getDeductions, updateDeductions } from "../../../../apis/pay-slip/deductions.api";

interface IDeduction {
    _id: string;
}

export interface IDeductionDetails {
  name: string;
  value: number;
  valueType: string;
}

export interface IIncomeTaxDeductionDetails {
  from: number;
  to: number;
  taxRate: number;
}

interface DeductionFormData {
  details: IDeductionDetails[];
  incomeDetails: IIncomeTaxDeductionDetails[];
}

const PayslipDeductions: React.FC = () => {

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [deduction, setDeduction] = useState<IDeduction>({
    _id: ""
  });

  const initialDeductionDetails: IDeductionDetails = {
    name: "",
    value: 0,
    valueType: ValueType.FIXED,
  };

  const initialIncomeTaxDetails: IIncomeTaxDeductionDetails = {
    from: 0,
    to: 0,
    taxRate: 0,
  };
  const initialFormData: DeductionFormData = {
    details: [initialDeductionDetails],
    incomeDetails: [initialIncomeTaxDetails],
  };
  const [formData, setFormData] = useState<DeductionFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof DeductionFormData, string>>
  >({});

    useEffect(() => {
      fetchDeductions()
    }, []);

  const fetchDeductions = async () => {
    setLoading(true);
    const response = await getDeductions();

    if(response?.success && (response?.data?.details?.length > 0 || response?.data?.incomeDetails?.length > 0)){
        setDeduction({_id:response?.data?._id})
        setFormData({
            details: response?.data?.details,
            incomeDetails: response?.data?.incomeDetails
        })
    } else {
        setDeduction({_id:""})
        setFormData(initialFormData)
    }
    setLoading(false);
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof DeductionFormData, string>> = {};

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      details: formData.details.filter((ele) => ele.name),
      incomeDetails: formData.incomeDetails.filter((ele) => ele?.to && ele?.taxRate),
    };

    const response = deduction._id
      ? await updateDeductions(payload, deduction._id)
      : await addDeductions(payload);
    if (response.success) {
      handleClose();
      fetchDeductions();
    }
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
  };

  const handleAddMore = (key: keyof DeductionFormData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], key === "details" ? initialDeductionDetails : initialIncomeTaxDetails],
    }));
  };

  const handleDeductionChange = (
    index: number,
    field: keyof IDeductionDetails,
    value: number | string,
  ) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.details];

      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };

      return {
        ...prev,
        details: updatedDetails,
      };
    });
  };

  const handleIncomeTaxDeductionChange = (
    index: number,
    field: keyof IIncomeTaxDeductionDetails,
    value: number | string,
  ) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.incomeDetails];

      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };

      return {
        ...prev,
        incomeDetails: updatedDetails,
      };
    });
  };

  const handleRemoveDeduction = (index: number, key: keyof DeductionFormData) => {
    if(key === "details"){
        setFormData((prev) => ({
          ...prev,
          [key]: prev.details.filter((_, i) => i !== index),
        }));
    } else {
        setFormData((prev) => ({
          ...prev,
          [key]: prev.incomeDetails.filter((_, i) => i !== index),
        }));
    }
  };

  return (
    <>
      <TopBar title="Payslip Deductions" />

      <div className="content-area bg-pageBg">
        <PageLoader loading={loading} />
        <form ref={formRef} method="POST" className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="bg-[#eff1f9] p-4">
            <div className="content-card w-full sm:w-[85%] p-4">
              <DeductionDetails
                deductions={formData.details}
                errors={undefined}
                handleDeductionChange={handleDeductionChange}
                addMore={handleAddMore}
                handleRemoveDeduction={handleRemoveDeduction}
              />
            </div>
          </div>
          <div className="bg-[#eff1f9] p-4">
            <div className="content-card w-full sm:w-[85%] p-4">
              <IncomeTaxDeductionDetails
                deductions={formData.incomeDetails}
                errors={undefined}
                handleIncomeTaxDeductionChange={handleIncomeTaxDeductionChange}
                addMore={handleAddMore}
                handleRemoveDeduction={handleRemoveDeduction}
              />
            </div>
          </div>
          <div className="bg-transparent">
            <div className="flex border-t p-4 justify-center gap-2">
              <Button name="Save" type="submit" size="sm" />
              <Button
                name="Cancel"
                variant="secondary"
                size="sm"
                onClick={handleClose}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PayslipDeductions;
