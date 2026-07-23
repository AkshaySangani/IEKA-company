import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import { IPromotion } from ".";
import {
  addPromotion,
  PromotionFormData,
  updatePromotion,
} from "../../../../apis/workforce/promotion.api";
import SelectField from "../../../common/select/SelectField";
import { IOption } from "../../../../types/common-types";
import { DateFormat, formatDate } from "../../../../utils/date-format";

interface IAddPromotionProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchPromotions: () => void;
  promotion: IPromotion;
  employees: any[];
  designations: IOption[];
}

const AddPromotion: React.FC<IAddPromotionProps> = ({
  isOpen,
  handleOpenClose,
  fetchPromotions,
  promotion,
  employees,
  designations
}) => {
  const [loading, setLoading] = useState(false);
  console.log("designations",designations)
  const initialFormData: PromotionFormData = {
    userId: "",
    designationId: "",
    effectiveDate: "",
    reason: "",
  };

  const [oldDesignation, setOldDesignation] = useState("");

  const [formData, setFormData] =
    useState<PromotionFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PromotionFormData, string>>
  >({});

  useEffect(() => {
    if (promotion?._id) {
      setFormData({
        userId: promotion?.userId._id,
        designationId: promotion?.designationId._id,
        effectiveDate: formatDate(promotion?.effectiveDate,DateFormat.ISO_DATE),
        reason: promotion?.reason,
      });
      if(promotion?.userId._id){
      const oldDesignation = promotion?.userId._id ? employees.find(ele => ele?.value === promotion?.userId._id)?.designation??"": "";
      setOldDesignation(oldDesignation)
    }
    } else {
      setFormData(initialFormData);
      setOldDesignation("");
    }
    // eslint-disable-next-line
  }, [promotion]);

  const handleChange = (field: keyof PromotionFormData, value: string) => {
    if(field === "userId"){
      const oldDesignation = value ? employees.find(ele => ele?.value === value)?.designation??"": "";
      setOldDesignation(oldDesignation)
    }
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
    const newErrors: Partial<Record<keyof PromotionFormData, string>> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.userId) {
      newErrors.userId = "Employee is required";
    }

    if (!formData.designationId.trim()) {
      newErrors.designationId = "Promotion to is required";
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = "Effective date is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const response = promotion?._id
      ? await updatePromotion(formData, promotion._id)
      : await addPromotion(formData);

    if (response.success) {
      fetchPromotions();
      resetForm();
      handleOpenClose();
    }

    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    handleOpenClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={promotion?._id ? "Edit Promotion" : "Add Promotion"}
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4">
        <SelectField
          label="Employee Name"
          required
          value={
            formData.userId
              ? (employees?.find((ele) => ele.value === formData.userId) ?? "")
              : ""
          }
          error={errors.userId}
          placeholder="Select employee"
          isMenuPortalTarget={false}
          options={employees}
          onChange={(option) => handleChange("userId", option?.value || "")}
          name={"userId"}
        />

        <TextField
          label="Promotion From"
          name="promotionFrom"
          value={oldDesignation}
          disabled
        />

        <SelectField
          label="Promotion To"
          required
          value={
            formData.designationId
              ? (designations?.find((ele) => ele.value === formData.designationId) ?? "")
              : ""
          }
          error={errors.designationId}
          placeholder="Select employee"
          isMenuPortalTarget={false}
          options={designations}
          onChange={(option) => handleChange("designationId", option?.value || "")}
          name={"designationId"}
        />

        <TextField
          type="date"
          label="Effective Date"
          name="effectiveDate"
          required
          value={formData.effectiveDate}
          error={errors.effectiveDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange("effectiveDate", e.target.value)}
        />

        <TextAreaField
          label="Reason"
          required
          value={formData.reason}
          error={errors.reason}
          placeholder="Enter reason"
          onChange={(e) => handleChange("reason", e.target.value)}
          name={"reason"}
        />
      </div>
    </Modal>
  );
};

export default AddPromotion;
