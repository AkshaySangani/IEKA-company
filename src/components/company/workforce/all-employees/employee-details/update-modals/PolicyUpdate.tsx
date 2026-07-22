import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { getPolicies } from "../../../../../../apis/organization/policy.api";
import { IEmployee, IPolicy } from "..";
import MonthPicker, { MonthPickerValue } from "../../../../../common/date-picker/MonthPicker";

interface PolicyUpdateProps {
  active: boolean;
  employeeData: IEmployee;
  policy: IPolicy;
  setActive: (value: boolean) => void;
  handleSubmit: (payload: any) => void;
  loading: boolean;
}

interface PolicyFormData {
  policyId: string;
  remarks: string;
  month: number;
  year: number;
}
export default function PolicyUpdate({
  active,
  employeeData,
  policy,
  setActive,
  handleSubmit,
  loading
}: PolicyUpdateProps) {
  const initialFormData: PolicyFormData = {
    policyId: policy.policyId._id,
    remarks: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);

  const [policies, setPolicies] = useState<IOption[]>([]);
  
  useEffect(() => {
    if (active) {
      fetchPolicies();
      setFormData(prev => ({...prev, policyId: policy.policyId._id}))
    }
  }, [active]);

  const fetchPolicies = async () => {
    const response = await getPolicies({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response.success) {
      setPolicies(
        response?.data?.policies?.map((ele: any) => ({
          label: ele?.name,
          value: ele?._id,
        })),
      );
    } else {
      setPolicies([]);
    }
  };

  const handleChange = (field: keyof PolicyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnSubmit = async () => {
    await handleSubmit(formData);
  }
  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData.lastName}`}
      width="max-w-2xl"
      onClose={() => setActive(false)}
      handleOnConfirm={handleOnSubmit}
      loading={loading}
    >
      <div className="flex flex-col gap-2">
        <ConfirmationHeader
          imageUrl={employeeData.profileImage}
          title="Are u sure want to change leave policy of this employee ?"
        />
        <form method="POST" className="grid grid-cols-1 gap-4">
          <RadioButton
            required
            label=""
            name="policyId"
            value={formData.policyId}
            options={policies}
            onChange={(value) => handleChange("policyId", value)}
          />
          <MonthPicker value={{month: formData.month, year: formData.year}} label="Effective From month" onChange={(value: MonthPickerValue) => {
            setFormData(prev => ({...prev, ...value}))
          }} />
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
