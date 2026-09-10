import { useState } from "react";
import { statusOptions } from "../../../../../../constants/constants";
import { statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import Note from "../../../../../common/note-area/Note";
import { updateEmployeeStatus } from "../../../../../../apis/workforce/all-employee.api";
import { IEmployee } from "..";

interface StatusUpdateProps {
  active: boolean;
  employeeData: IEmployee;
  setActive: (value: boolean) => void;
  status: statusEnum;
  refreshData: () => void;
}

interface StatusFormData {
  status: statusEnum;
  remarks: string;
}
export default function StatusUpdate({
  active,
  employeeData,
  setActive,
  status,
  refreshData,
}: StatusUpdateProps) {
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const initialFormData: StatusFormData = {
    status: status,
    remarks: "",
  };
  const [formData, setFormData] = useState<StatusFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StatusFormData, string>>
  >({});

  const handleChange = (field: keyof StatusFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors(prev => ({
      ...prev, [field]: ""
    }))
  };

  // handle validate fields
  const validate = () => {
    const newErrors: Partial<Record<keyof StatusFormData, string>> = {};

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.remarks.trim()) {
      newErrors.remarks = "Remarks are required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      return false;
    }

    return true;
  };

  const handleStatusSubmit = async () => {
    if (!validate()) return;
    setStatusLoading(true);

    const response = await updateEmployeeStatus(formData, employeeData._id);
    if (response.success) {
      refreshData();
    }
    setStatusLoading(false);
  };
  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData.lastName}`}
      width="max-w-2xl"
      onClose={() => setActive(false)}
      loading={statusLoading}
      handleOnConfirm={handleStatusSubmit}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={employeeData?.profileImage}
          title="Are you sure you want to update status for this employee?"
        />
        {/* <div className="flex justify-center bg-primaryBlur p-2">
          <div className="flex items-center gap-2">
            <div className="font-medium">Total People Managed</div>
            <div className="bg-primary px-3 py-1 text-white font-medium text-center">
              5
            </div>
          </div>
        </div> */}
        <div className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label="Status"
            name="status"
            value={formData.status}
            options={statusOptions}
            error={errors.status}
            onChange={(value) => handleChange("status", value)}
          />
          <TextAreaField
            required
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            placeholder="Enter remarks..."
            error={errors.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </div>
        {formData.status === statusEnum.ACTIVE && (
          <Note
            variant="danger"
            message="After active this employee all rights of this employee are accessible."
          />
        )}
      </div>
    </Modal>
  );
}
