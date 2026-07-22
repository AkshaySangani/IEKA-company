import { useState } from "react";
import DetailRow from "../../../../../common/detail-row";
import Accordion from "../../../../../common/accordian";
import Modal from "../../../../../common/modal/Modal";
import TextField from "../../../../../common/text-field/TextField";
import { IParents } from "../../../onboarding/employee-details";
import { regex } from "../../../../../../constants/validation-regex";

interface PatentsDetailsProps {
  parents: IParents;
  loading: boolean;
  handleSubmit: (formData: FormData) => void;
}
const ParentsDetails = ({parents, loading, handleSubmit}: PatentsDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
   const [errors, setErrors] = useState<any>({});

  const initialFormData = {
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleClickOnEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    setOpen((prev) => {
      if (!prev) {
        setFormData({
          fatherName: parents.fatherName || "",
          fatherPhone: String(parents.fatherPhone || ""),
          fatherOccupation: parents.fatherOccupation || "",
          motherName: parents.motherName || "",
          motherPhone: String(parents.motherPhone || ""),
          motherOccupation: parents.motherOccupation || "",
        });

        setErrors({});
      }

      return !prev;
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name is required";
    }

    if (!formData.fatherPhone.trim()) {
      newErrors.fatherPhone = "Father phone is required";
    } else if (!regex.phone.test(formData.fatherPhone)) {
      newErrors.fatherPhone = "Invalid phone number";
    }

    if (!formData.fatherOccupation.trim()) {
      newErrors.fatherOccupation =
        "Father occupation is required";
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName = "Mother name is required";
    }

    if (!formData.motherPhone.trim()) {
      newErrors.motherPhone = "Mother phone is required";
    } else if (!regex.phone.test(formData.motherPhone)) {
      newErrors.motherPhone = "Invalid phone number";
    }

    if (!formData.motherOccupation.trim()) {
      newErrors.motherOccupation =
        "Mother occupation is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (!validate()) return;

    const form = new FormData();

    form.append("fatherName", formData.fatherName);
    form.append("fatherPhone", formData.fatherPhone);
    form.append(
      "fatherOccupation",
      formData.fatherOccupation,
    );

    form.append("motherName", formData.motherName);
    form.append("motherPhone", formData.motherPhone);
    form.append(
      "motherOccupation",
      formData.motherOccupation,
    );

    try {
      await handleSubmit(form);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Accordion
        active={active}
        setActive={setActive}
        header={
          <div className="flex items-center gap-2">
            <i
              className="fa-solid fa-pen-to-square text-gray-400"
              onClick={handleClickOnEdit}
            ></i>
            <h3 className="text-md text-gray-600 font-semibold">
              Parents Details
            </h3>
          </div>
        }
      >
        <div className="space-y-2">
          <DetailRow label="Father Name" value={parents.fatherName} />

          <DetailRow
            label="Father Phone"
            value={parents.fatherPhone}
          />

          <DetailRow
            label="Father Occupation"
            value={parents.fatherOccupation}
          />

          <DetailRow
            label="Mother Name"
            value={parents.motherName}
          />

          <DetailRow
            label="Mother Phone"
            value={parents.motherPhone}
          />

          <DetailRow
            label="Mother Occupation"
            value={parents.motherOccupation}
          />
        </div>
      </Accordion>
      <Modal isOpen={open} title={"Parent Details"} loading={loading} onClose={handleClose} handleOnConfirm={handleOnSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white">
          {/* First Name */}
          <TextField
            label="Father Name"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            error={errors.fatherName}
            placeholder="Enter Father Name"
            required
          />

          {/* Last Name */}
          <TextField
            label="Father Phone"
            type="number"
            name="fatherPhone"
            value={formData.fatherPhone}
            onChange={handleChange}
            error={errors.fatherPhone}
            placeholder="Enter Father Phone"
            required
          />

          
          <TextField
            label="Father Occupation"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            error={errors.fatherOccupation}
            placeholder="Enter Father Occupation"
            required
          />

          {/* Email */}
          <TextField
            label="Mother Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            error={errors.motherName}
            placeholder="Enter Mother Name"
            required
          />

          {/* Phone */}
          <TextField
            label="Mother Phone"
            name="motherPhone"
            type="number"
            value={formData.motherPhone}
            onChange={handleChange}
            error={errors.motherPhone}
            placeholder="Enter Mother Phone"
            required
          />

          <TextField
            label="Mother Occupation"
            name="motherOccupation"
            value={formData.motherOccupation}
            onChange={handleChange}
            error={errors.motherOccupation}
            placeholder="Enter Mother Occupation"
            required
          />
        </div>
      </Modal>
    </>
  );
};

export default ParentsDetails;
