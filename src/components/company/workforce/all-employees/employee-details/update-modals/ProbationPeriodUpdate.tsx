import { useState } from "react";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { probationPeriodOptions } from "../../../../../../constants/constants";

interface ProbationPeriodUpdateProps {
  active: boolean;
  profileImage: string;
  employeeName: string;
  setActive: (value: boolean) => void;
  probationPeriod: number;
  handleSubmit: (payload: any) => void;
  loading: boolean;
}

interface ProbationPeriodFormData {
  probationPeriod: number;
  remarks: string;
}
export default function ProbationPeriodUpdate({
  active,
  profileImage,
  employeeName,
  setActive,
  probationPeriod,
  handleSubmit,
  loading
}: ProbationPeriodUpdateProps) {
  const initialFormData: ProbationPeriodFormData = {
    probationPeriod: probationPeriod,
    remarks: "",
  };

  
  const [formData, setFormData] = useState<ProbationPeriodFormData>(initialFormData);

  // useEffect(() => {
  //   if(probationPeriod){
  //     setFormData(prev => ({...prev, probationPeriod: String(probationPeriod)}))
  //   }
  // }, [probationPeriod]);

  const handleChange = (field: keyof ProbationPeriodFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
  };

  const handleOnSubmit = async () => {
    await handleSubmit(formData);
  }
  return (
    <Modal
      isOpen={active}
      title={employeeName}
      width = "max-w-2xl"
      loading={loading}
      onClose={() => setActive(false)}
      handleOnConfirm={handleOnSubmit}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={profileImage}
          title="Are you sure you want to update status for this employee?"
        />
        <form method="POST" className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label="Probational Period"
            name="probationPeriod"
            value={formData.probationPeriod}
            options={probationPeriodOptions}
            onChange={(value) => handleChange("probationPeriod", value)}
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
