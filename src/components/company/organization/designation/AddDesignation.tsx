import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import { IDesignation } from ".";
import { addDesignation, updateDesignation } from "../../../../apis/organization/designation.api";

interface IAddDesignationProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchDesignationList: () => void;
  designation: IDesignation;
}

interface DesignationFormData {
  name: string;
  description: string;
}

const AddDesignation: React.FC<IAddDesignationProps> = ({
  isOpen,
  handleOpenClose,
  fetchDesignationList,
  designation,
}) => {
  const [loading, setLoading] = useState(false);
  const initialFormData: DesignationFormData = {
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState<DesignationFormData>(initialFormData);

  useEffect(() => {
    if (designation._id) {
      setFormData({
          name: designation.name,
          description: designation.description,
      })
    }
    // eslint-disable-next-line
  }, [designation._id]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof DesignationFormData, string>>
  >({});

  const handleChange = (field: keyof DesignationFormData, value: string) => {
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
    const newErrors: Partial<Record<keyof DesignationFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Designation name is required";
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

    const response = designation._id
      ? await updateDesignation(formData, designation._id)
      : await addDesignation(formData);
    if (response.success) {
      fetchDesignationList();
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
      title="Add Designation"
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4">
        <TextField
          label="Designation Name"
          name="name"
          value={formData.name}
          error={errors.name}
          placeholder="Enter designation name"
          required
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextAreaField
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

export default AddDesignation;
