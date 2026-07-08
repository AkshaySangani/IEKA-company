import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import RadioButton from "../../../common/radio-button";
import {
  branchEnum,
  branchOptions,
  yesNoOption,
} from "../../../../constants/constants";
import {
  addBranch,
  updateBranch,
} from "../../../../apis/organization/branch.api";
import { BranchType } from "../../../../types/common-types";
import { IBranch } from ".";

interface IAddBranchProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchBranchList: () => void;
  branchDetails: IBranch;
}

interface BranchFormData {
  name: string;
  address: string;
  shiftApplicable: "YES" | "NO";
  branchType: BranchType;
}

const AddBranch: React.FC<IAddBranchProps> = ({
  isOpen,
  handleOpenClose,
  fetchBranchList,
  branchDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const initialFormData: BranchFormData = {
    name: "",
    address: "",    
    shiftApplicable: "NO",
    branchType: branchEnum.HEAD_OFFICE,
  };
  const [formData, setFormData] = useState<BranchFormData>(initialFormData);
  console.log("formData", formData);

  useEffect(() => {
    if (branchDetails._id) {
      setFormData({
          name: branchDetails.name,
          address: branchDetails.address,
          branchType: branchDetails.branchType,
          shiftApplicable: branchDetails.shiftApplicable ? "YES" : "NO"
      })
    }
    // eslint-disable-next-line
  }, [branchDetails._id]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof BranchFormData, string>>
  >({});

  const handleChange = (field: keyof BranchFormData, value: string) => {
    console.log("value", field, value);
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
    const newErrors: Partial<Record<keyof BranchFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Branch name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Branch address is required";
    }

    if (!formData.shiftApplicable) {
      newErrors.shiftApplicable = "Please select shift applicability";
    }

    if (!formData.branchType) {
      newErrors.branchType = "Please select branch type";
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

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      shiftApplicable: formData.shiftApplicable === "YES",
      branchType: formData.branchType,
    };

    const response = branchDetails._id
      ? await updateBranch(payload, branchDetails._id)
      : await addBranch(payload);
    if (response.success) {
      fetchBranchList();
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
      title="Add Branch"
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleSubmit}
    >
      <div className="grid grid-cols-1 w-[75%] gap-4">
        <TextField
          label="Branch Name"
          name="name"
          value={formData.name}
          error={errors.name}
          placeholder="Enter branch name"
          required
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextAreaField
          label="Branch Address"
          name="address"
          value={formData.address}
          error={errors.address}
          placeholder="Enter branch address"
          required
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <RadioButton
          required
          label="Shift Applicable on this Branch?"
          name="shiftApplicable"
          value={formData.shiftApplicable}
          options={yesNoOption}
          onChange={(value) => handleChange("shiftApplicable", value)}
          error={errors.shiftApplicable}
        />        

        <RadioButton
          required
          label="Branch Type"
          name="branchType"
          value={formData.branchType}
          options={branchOptions}
          onChange={(value) => handleChange("branchType", value)}
          error={errors.branchType}
        />
      </div>
    </Modal>
  );
};

export default AddBranch;
