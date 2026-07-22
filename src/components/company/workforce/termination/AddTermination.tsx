import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import { ITermination } from ".";
import {
  addTermination,
  TerminationFormData,
  updateTermination,
} from "../../../../apis/workforce/termination.api";
import SelectField from "../../../common/select/SelectField";
import { IOption } from "../../../../types/common-types";

interface IAddTerminationProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchTerminations: () => void;
  termination: ITermination;
  employees: IOption[];
}

const AddTermination: React.FC<IAddTerminationProps> = ({
  isOpen,
  handleOpenClose,
  fetchTerminations,
  termination,
  employees,
}) => {
  const [loading, setLoading] = useState(false);

  const initialFormData: TerminationFormData = {
    userId: "",
    terminationType: "",
    lastWorkingDate: "",
    reason: "",
  };

  const [formData, setFormData] =
    useState<TerminationFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof TerminationFormData, string>>
  >({});

  useEffect(() => {
    if (termination?._id) {
      setFormData({
        userId: termination?.userId._id,
        terminationType: termination?.terminationType,
        lastWorkingDate: termination?.lastWorkingDate,
        reason: termination?.reason,
      });
    } else {
      setFormData(initialFormData);
    }
    // eslint-disable-next-line
  }, [termination]);

  const handleChange = (field: keyof TerminationFormData, value: string) => {
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
    const newErrors: Partial<Record<keyof TerminationFormData, string>> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.userId) {
      newErrors.userId = "Employee is required";
    }

    if (!formData.terminationType.trim()) {
      newErrors.terminationType = "Termination type is required";
    }

    if (!formData.lastWorkingDate) {
      newErrors.lastWorkingDate = "Last working date is required";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    if (formData.lastWorkingDate) {
      const lastWorkingDate = new Date(formData.lastWorkingDate);

      lastWorkingDate.setHours(0, 0, 0, 0);

      if (lastWorkingDate < today) {
        newErrors.lastWorkingDate = "Past dates are not allowed";
      }
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

    const response = termination?._id
      ? await updateTermination(formData, termination._id)
      : await addTermination(formData);

    if (response.success) {
      fetchTerminations();
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
      title={termination?._id ? "Edit Termination" : "Add Termination"}
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
          label="Termination Type"
          name="terminationType"
          required
          value={formData.terminationType}
          error={errors.terminationType}
          placeholder="Enter termination type"
          onChange={(e) => handleChange("terminationType", e.target.value)}
        />

        <TextField
          type="date"
          label="Last Working Date"
          name="lastWorkingDate"
          required
          value={formData.lastWorkingDate}
          error={errors.lastWorkingDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange("lastWorkingDate", e.target.value)}
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

export default AddTermination;
