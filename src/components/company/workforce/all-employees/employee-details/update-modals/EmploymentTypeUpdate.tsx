import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { employmentTypeOptions } from "../../../../../../constants/constants";

interface EmploymentTypeUpdateProps {
  active: boolean;
  profileImage: string;
  employeeName: string;
  setActive: (value: boolean) => void;
  status: statusEnum;
  refreshData: () => void;
}

interface EmploymentTypeFormData {
  employmentType: string;
  remarks: string;
}
export default function EmploymentTypeUpdate({
  active,
  profileImage,
  employeeName,
  setActive,
  status,
  refreshData,
}: EmploymentTypeUpdateProps) {
  const initialFormData: EmploymentTypeFormData = {
    employmentType: "",
    remarks: "",
  };
  const [formData, setFormData] = useState<EmploymentTypeFormData>(initialFormData);

  const handleChange = (field: keyof EmploymentTypeFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
  };
  return (
    <Modal
      isOpen={active}
      title={employeeName}
      width = "max-w-2xl"
      onClose={() => setActive(false)}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={profileImage}
          title="Are you sure you want to update status for this employee?"
        />
        <form method="POST" className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            options={employmentTypeOptions}
            onChange={(value) => handleChange("employmentType", value)}
          />
          <TextAreaField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            placeholder="Enter remarks..."
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </form>
      </div>
    </Modal>
  );
}
