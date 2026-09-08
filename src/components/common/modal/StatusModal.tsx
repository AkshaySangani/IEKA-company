import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../types/common-types";
import { statusOptions } from "../../../constants/constants";
import Modal from "./Modal";
import RadioButton from "../radio-button";
import TextAreaField from "../text-area/TextAreaField";
import excliMinate from "../../../assets/images/excliminate.png";
import Image from "../image";
import Note from "../note-area/Note";

interface IStatusUpdateProps {
  isOpen: boolean;
  status: statusEnum;
  title: string;
  showFullTitle?: boolean;
  loading: boolean;
  options?: IOption[];
  handleOpenClose: () => void;
  handleSubmit: (value: FormDataPayload) => void;
  deleteWarning?: string;
}

interface FormDataPayload {
  status: statusEnum;
  remarks: string;
}

interface FormErrors {
  status?: string;
  remarks?: string;
}

const initialFormData: FormDataPayload = {
  status: statusEnum.ACTIVE,
  remarks: "",
};

const StatusUpdateModal: React.FC<IStatusUpdateProps> = ({
  isOpen,
  title = "",
  showFullTitle = false,
  handleOpenClose,
  handleSubmit,
  status,
  loading,
  options = statusOptions,
  deleteWarning = "Deleting this item will remove it permanently from the system. Please proceed with caution.",
}) => {
  const [formData, setFormData] = useState<FormDataPayload>({
    ...initialFormData,
    status,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (status) {
      setFormData({
        status,
        remarks: "",
      });

      setErrors({});
    }
  }, [status, isOpen]);

  const handleChange = (
    field: keyof FormDataPayload,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts correcting it
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.remarks.trim()) {
      newErrors.remarks = "Remarks are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    handleOpenClose();
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    await handleSubmit({
      status: formData.status,
      remarks: formData.remarks.trim(),
    });

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Status Update"
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleConfirm}
    >
      <>
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <Image
            src={excliMinate}
            fallbackSrc={excliMinate}
            alt="excliMinate"
            width={50}
          />

          <h3 className="text-lg font-medium">
            {showFullTitle
              ? title
              : `Are you sure you want to update status for this ${title}?`}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label="Status"
            name="status"
            value={formData.status}
            options={options}
            error={errors.status}
            onChange={(value) => handleChange("status", value)}
          />

          <TextAreaField
            label="Remarks"
            name="remarks"
            required
            value={formData.remarks}
            error={errors.remarks}
            placeholder="Enter remarks..."
            onChange={(e) =>
              handleChange("remarks", e.target.value)
            }
          />
        </div>

        {formData.status === statusEnum.DELETED && (
          <Note
            variant="danger"
            message={deleteWarning}
          />
        )}
      </>
    </Modal>
  );
};

export default StatusUpdateModal;