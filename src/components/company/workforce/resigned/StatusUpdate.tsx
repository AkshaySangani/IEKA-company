import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../../types/common-types";
import { statusOptions } from "../../../../constants/constants";
import Modal from "../../../common/modal/Modal";
import Image from "../../../common/image";
import RadioButton from "../../../common/radio-button";
import TextAreaField from "../../../common/text-area/TextAreaField";
import Note from "../../../common/note-area/Note";
import excliMinate from "../../../../assets/images/excliminate.png";
import DatePickerField from "../../../common/date-picker/DatePicker";
import { DateFormat, formatDate } from "../../../../utils/date-format";

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
  lastWorkingDate: string;
  remarks: string;
}

interface FormErrors {
  status?: string;
  lastWorkingDate?: string;
  remarks?: string;
}

const initialFormData: FormDataPayload = {
  status: statusEnum.ACTIVE,
  lastWorkingDate: "",
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
        lastWorkingDate: "",
        remarks: "",
      });

      setErrors({});
    }
  }, [status, isOpen]);

  const handleChange = (field: keyof FormDataPayload, value: string) => {
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

    if (formData.status === statusEnum.ACCEPTED) {
      if (!formData.lastWorkingDate) {
        newErrors.lastWorkingDate = "Last working date is required.";
      } else {
        const selectedDate = new Date(formData.lastWorkingDate);
        const today = new Date();

        // Remove time from today's date
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.lastWorkingDate =
            "Last working date cannot be in the past.";
        }
      }
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
      lastWorkingDate: formatDate(
        formData.lastWorkingDate,
        DateFormat.ISO_DATE,
      ),
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

          {/* Last Working Date */}
          {formData.status === statusEnum.ACCEPTED && <DatePickerField
            label="Last Working Date"
            required
            name="lastWorkingDate"
            value={formData.lastWorkingDate}
            error={errors.lastWorkingDate}
            onChange={(date: string): void =>
              handleChange("lastWorkingDate", date)
            }
            minDate={new Date()}
          />}

          <TextAreaField
            label="Remarks"
            name="remarks"
            required
            value={formData.remarks}
            error={errors.remarks}
            placeholder="Enter remarks..."
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </div>

        {formData.status === statusEnum.DELETED && (
          <Note variant="danger" message={deleteWarning} />
        )}
      </>
    </Modal>
  );
};

export default StatusUpdateModal;
