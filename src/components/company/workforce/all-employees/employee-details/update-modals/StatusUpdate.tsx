import { useState } from "react";
import { statusOptions } from "../../../../../../constants/constants";
import { statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import Note from "../../../../../common/note-area/Note";
import { updateEmployeeStatus } from "../../../../../../apis/workforce/all-employee.api";

interface StatusUpdateProps {
  active: boolean;
  profileImage: string;
  employeeName: string;
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
  profileImage,
  employeeName,
  setActive,
  status,
  refreshData,
}: StatusUpdateProps) {
  const [statusLoading,setStatusLoading] = useState<boolean>(false);
  const initialFormData: StatusFormData = {
    status: status,
    remarks: "",
  };
  const [formData, setFormData] = useState<StatusFormData>(initialFormData);

  const handleChange = (field: keyof StatusFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
  };

  const handleStatusSubmit = async (formData: {
      status: statusEnum;
      remarks: string;
    }) => {
      setStatusLoading(true);
  
      const payload = {
        status: formData.status.trim(),
        remarks: formData.remarks,
      };
  
      // const response = await updateEmployeeStatus(payload, employeeDetails._id);
      // if (response.success) {
      //   handleRefreshData();
      // }
      setStatusLoading(false);
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
        <div className="flex justify-center bg-primaryBlur p-2">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Total People Managed</div>
            <div className="bg-primary px-3 py-1 text-white font-semibold text-center">
              5
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label="Status"
            name="status"
            value={formData.status}
            options={statusOptions}
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
        {formData.status === statusEnum.ACTIVE && <Note variant="danger" message="After active this employee all rights of this employee are accessible."/>}
      </div>
    </Modal>
  );
}
