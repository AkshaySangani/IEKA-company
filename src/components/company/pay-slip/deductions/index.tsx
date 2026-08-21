import { useEffect, useRef, useState } from "react";
import { ValueType } from "../../../../types/common-types";
import TopBar from "../../../common/topbar/TopBar";
import PageLoader from "../../../common/loader/PageLoader";
import DeductionDetails from "./DeductionDetails";
import Button from "../../../common/button/Button";
import IncomeTaxDeductionDetails from "./IncomeTaxDeductionDetails";
import {
  getDeductions,
  updateDeductions,
} from "../../../../apis/pay-slip/deductions.api";
import ActionModal from "../../../common/modal/ActionModal";

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

interface IAction {
  index: number | null;
  key: string;
}

export interface DeductionFormData {
  details: IDeductionDetails[];
  incomeDetails: IIncomeTaxDeductionDetails[];
}

const PayslipDeductions: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [deduction, setDeduction] = useState<IDeduction>({
    _id: "",
  });

  const initialDeductionDetails: IDeductionDetails[] = [];

  const initialIncomeTaxDetails: IIncomeTaxDeductionDetails = {
    from: 0,
    to: 0,
    taxRate: 0,
  };
  const initialFormData: DeductionFormData = {
    details: initialDeductionDetails,
    incomeDetails: [initialIncomeTaxDetails],
  };
  const [formData, setFormData] = useState<DeductionFormData>(initialFormData);

  const [actionOpen, setActionOpen] = useState<boolean>(false);
  const initialAction: IAction = {
    index: null,
    key: "",
  };
  const [show, setShow] = useState<IAction>(initialAction);

  const [errors, setErrors] = useState<
    Partial<Record<keyof DeductionFormData, string>>
  >({});

  useEffect(() => {
    fetchDeductions();
    // eslint-disable-next-line
  }, []);

  const fetchDeductions = async () => {
    setLoading(true);
    const response = await getDeductions();

    if (
      response?.success &&
      (response?.data?.details?.length > 0 ||
        response?.data?.incomeDetails?.length > 0)
    ) {
      setDeduction({ _id: response?.data?._id });
      setFormData({
        details: response?.data?.details,
        incomeDetails: response?.data?.incomeDetails,
      });
    } else {
      setDeduction({ _id: "" });
      setFormData(initialFormData);
    }
    setLoading(false);
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof DeductionFormData, string>> = {};
    const details = formData.details.filter((ele) => ele.name && ele.value);
    if (details?.length === 0) {
      newErrors.details = "At least one deduction is required.";
    }

    const incomeDetail = formData.incomeDetails.filter((ele) => ele?.to);
    if (incomeDetail?.length === 0) {
      newErrors.incomeDetails =
        "At least one income tax deduction is required.";
    }
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
      details: formData.details
        .filter((ele) => ele.name)
        .map((ele) => ({ ...ele, value: Number(ele.value) })),
      incomeDetails: formData.incomeDetails
        .filter((ele) => ele?.to)
        .map((ele) => ({
          ...ele,
          from: Number(ele?.from),
          to: Number(ele?.to),
          taxRate: Number(ele?.taxRate),
        })),
    };

    const response = await updateDeductions(payload);
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
      [key]: [
        ...prev[key],
        key === "details"
          ? {
              name: "",
              value: 0,
              valueType: ValueType.FIXED,
            }
          : initialIncomeTaxDetails,
      ],
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

  const handleRemoveDeduction = (
    index: number,
    key: keyof DeductionFormData | string,
  ) => {
    if (key === "details") {
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

  const handleAction = () => {
    if (!validate()) return;
    setActionOpen((prev) => !prev);
  };

  const handleRemoveConfirmation = (
    index: number,
    key: keyof DeductionFormData,
  ) => {
    setShow({
      index,
      key,
    });
  };

  const handleOnConfirm = async () => {
    await formRef.current?.requestSubmit();
  };

  return (
    <>
      <TopBar
        title="Payslip Deductions"
        actionButtons={
          <Button name="Action" size="sm" onClick={handleAction} />
        }
      />

      <div className="content-area bg-pageBg">
        <PageLoader loading={loading} />
        <form
          ref={formRef}
          method="POST"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <div className="bg-[#eff1f9] p-4">
            <div className="content-card w-full sm:w-[85%] p-4">
              <DeductionDetails
                deductions={formData.details}
                errors={errors}
                handleDeductionChange={handleDeductionChange}
                addMore={handleAddMore}
                handleRemoveDeduction={handleRemoveConfirmation}
              />
            </div>
          </div>
          <div className="bg-[#eff1f9] p-4">
            <div className="content-card w-full sm:w-[85%] p-4">
              <IncomeTaxDeductionDetails
                deductions={formData.incomeDetails}
                errors={errors}
                handleIncomeTaxDeductionChange={handleIncomeTaxDeductionChange}
                addMore={handleAddMore}
                handleRemoveDeduction={handleRemoveConfirmation}
              />
            </div>
          </div>
        </form>
      </div>
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to ${deduction?._id ? "edit" : "add"} this deductions?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
      <ActionModal
        isOpen={show.index !== null}
        title={`Are you sure you want remove this ${show.key === "incomeDetails" ? "income tax" : "deduction"} detail row?`}
        loading={false}
        handleOpenClose={() => setShow(initialAction)}
        handleSubmit={() => {
          show.index !== null &&
            show.key !== "" &&
            handleRemoveDeduction(show.index, show.key);
        }}
      />
    </>
  );
};

export default PayslipDeductions;
