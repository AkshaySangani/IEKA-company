import { useEffect, useRef, useState } from "react";
import TextField from "../../../../common/text-field/TextField";
import { pathNames } from "../../../../../constants/constants";
import { IEarning } from "..";
import TopBar from "../../../../common/topbar/TopBar";
import PageLoader from "../../../../common/loader/PageLoader";
import Button from "../../../../common/button/Button";
import EarningDetails from "./EarningDetails";
import { ValueType } from "../../../../../types/common-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addEarnings,
  updateEarning,
} from "../../../../../apis/pay-slip/earnings.api";

export interface IEarningDetails {
  name: string;
  value: number;
  valueType: string;
}

interface EarningFormData {
  name: string;
  details: IEarningDetails[];
}

const PayslipDisclaimer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const earningData = location.state?.data;

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);

  const initialEarningDetails: IEarningDetails = {
    name: "",
    value: 0,
    valueType: ValueType.FIXED,
  };
  const initialFormData: EarningFormData = {
    name: "",
    details: [initialEarningDetails],
  };
  const [formData, setFormData] = useState<EarningFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof EarningFormData, string>>
  >({});

  useEffect(() => {
    if (earningData?._id) {
      setFormData({
        name: earningData?.name,
        details: earningData?.details,
      });
    }
  }, [earningData?._id]);

  const handleChange = (
    field: keyof EarningFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof EarningFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Earning name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      ...formData,
      details: formData.details.filter((ele) => ele.name),
    };

    const response = earningData._id
      ? await updateEarning(payload, earningData._id)
      : await addEarnings(payload);
    if (response.success) {
      handleClose();
    }
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    navigate(pathNames.EARNING);
  };

  const handleAddMore = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, initialEarningDetails],
    }));
  };

  const handleEarningChange = (
    index: number,
    field: keyof IEarningDetails,
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

  const handleRemoveEarning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <TopBar
        title="Payslip Disclaimer"
        actionButtons={
          <Button
            type="button"
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        }
      />

      <div className="content-area bg-pageBg">
        <PageLoader loading={loading} />
        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          <div className="w-full sm:w-[30%] mb-3">
            <TextField
              label="Payslip Name"
              name="name"
              value={formData.name}
              error={errors.name}
              placeholder="Enter payslip name"
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="bg-[#eff1f9] p-4">
            <div className="content-card w-full sm:w-[70%] p-4">
              <EarningDetails
                earnings={formData.details}
                errors={undefined}
                handleEarningChange={handleEarningChange}
                addMore={handleAddMore}
                handleRemoveEarning={handleRemoveEarning}
              />
            </div>
          </div>
          <div className="bg-transparent">
            <div className="flex border-t p-4 justify-center gap-2">
              <Button name="Save" type="submit" size="sm" />
              <Button name="Cancel" variant="secondary" size="sm" onClick={handleClose}/>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PayslipDisclaimer;
