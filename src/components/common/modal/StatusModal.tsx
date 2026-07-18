import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../types/common-types";
import { statusOptions } from "../../../constants/constants";
import Modal from "./Modal";
import RadioButton from "../radio-button";
import TextAreaField from "../text-area/TextAreaField";
import excliMinate from "../../../assets/images/excliminate.png";
import Image from "../image";

interface IStatusUpdateProps {
  isOpen: boolean;
  status: statusEnum;
  title: string;
  loading: boolean;
  options?: IOption[];
  handleOpenClose: () => void;
  handleSubmit: (value: FormDataPayload) => void;
}

interface FormDataPayload {
  status: statusEnum;
  remarks: string;
}

const initialFormData: FormDataPayload = {
  status: statusEnum.ACTIVE,
  remarks: "",
};

const StatusUpdateModal: React.FC<IStatusUpdateProps> = ({
  isOpen,
  title = "",
  handleOpenClose,
  handleSubmit,
  status,
  loading,
  options = statusOptions,
}) => {
  const [formData, setFormData] = useState<FormDataPayload>(initialFormData);

  useEffect(() => {
    if (status) {
      setFormData({
        status: status,
        remarks: "",
      });
    }
  }, [status]);

  const handleChange = (field: keyof FormDataPayload, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleClose = () => {
    resetForm();
    handleOpenClose();
  };

  const handleConfirm = async () => {
    await handleSubmit(formData);
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

          <h3 className="text-lg font-semibold">
            Are you sure you want to update status for this {title}?
          </h3>
        </div>
        <div className="grid grid-cols-1 w-[75%] gap-4">
          <RadioButton
            required
            label="Status"
            name="status"
            value={formData.status}
            options={options}
            onChange={(value) => handleChange("status", value)}
          />
          <TextAreaField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            placeholder="Enter remarks..."
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </div>
      </>
    </Modal>
  );
};

export default StatusUpdateModal;
