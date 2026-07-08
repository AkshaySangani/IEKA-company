import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import RadioButton from "../../../common/radio-button";
import {
  leaveTypeEnum,
  leaveTypeOptions,
} from "../../../../constants/constants";
import { ILeave } from ".";
import { addLeave, updateLeave } from "../../../../apis/organization/leave.api";

interface IAddLeaveProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchLeaveList: () => void;
  leave: ILeave;
}

interface LeaveFormData {
  name: string;
  description: string;
  isPaid: "PAID" | "UNPAID";
}

const AddLeave: React.FC<IAddLeaveProps> = ({
  isOpen,
  handleOpenClose,
  fetchLeaveList,
  leave,
}) => {
  const [loading, setLoading] = useState(false);
  const initialFormData: LeaveFormData = {
    name: "",
    description: "",
    isPaid: leaveTypeEnum.PAID
  };
  const [formData, setFormData] = useState<LeaveFormData>(initialFormData);

  useEffect(() => {
    if (leave._id) {
      setFormData({
          name: leave.name,
          description: leave.description,
          isPaid: leave.isPaid ? leaveTypeEnum.PAID : leaveTypeEnum.UNPAID
      })
    }
  }, [leave._id]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LeaveFormData, string>>
  >({});

  const handleChange = (field: keyof LeaveFormData, value: string | boolean) => {
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
    const newErrors: Partial<Record<keyof LeaveFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Leave name is required";
    }

    if (!formData.description) {
      newErrors.name = "Description is required";
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

    const payload = {...formData, isPaid: formData.isPaid === leaveTypeEnum.PAID};
    const response = leave._id
      ? await updateLeave(payload, leave._id)
      : await addLeave(payload);
    if (response.success) {
      fetchLeaveList();
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
      title="Add Leave"
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleSubmit}
    >
      <div className="grid grid-cols-1 w-[75%] gap-4">
        <TextField
          label="Leave Name"
          name="name"
          value={formData.name}
          error={errors.name}
          placeholder="Enter leave name"
          required
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <RadioButton label="Leave Type" required name={"isPaid"} value={formData.isPaid} options={leaveTypeOptions} onChange={(value) => handleChange("isPaid", value)} />

        <TextAreaField
        required
          label="Description"
          name="description"
          value={formData.description}
          error={errors.description}
          placeholder="Enter description"
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default AddLeave;
