import { useState } from "react";
import DetailRow from "../../../../../common/detail-row";
import Accordion from "../../../../../common/accordian";
import Modal from "../../../../../common/modal/Modal";
import SelectField from "../../../../../common/select/SelectField";
import {
  bloodGroupOptions,
  gender,
  genderOptions,
  maritalStatusOptions,
} from "../../../../../../constants/constants";
import TextField from "../../../../../common/text-field/TextField";
import { DateFormat, formatDate } from "../../../../../../utils/date-format";
import { IEmployee } from "../../../onboarding/employee-details";
import { updateEmployee } from "../../../../../../apis/workforce/all-employee.api";
import { regex } from "../../../../../../constants/validation-regex";

interface PersonalDetailsProps {
  employee: IEmployee;
  loading: boolean;
  handleSubmit: (formData: FormData) => void;
}
const PersonDetails = ({
  employee,
  loading,
  handleSubmit,
}: PersonalDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const initialFormData = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    bloodGroup: "",
    isMarried: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleClickOnEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setOpen((prev) => {
      if (!prev) {
        setFormData({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          dob: formatDate(employee.dob, DateFormat.ISO_DATE),
          gender: employee.gender || "",
          email: employee.email || "",
          phone: String(employee.phone),
          bloodGroup: employee.bloodGroup || "",
          isMarried: employee.isMarried ? "married" : "single",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!regex.email.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!regex.phone.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (!validate()) return;

    const form = new FormData();

    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("dob", formData.dob);
    form.append("gender", formData.gender);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("bloodGroup", formData.bloodGroup);
    form.append("isMarried", String(formData.isMarried === "married"));

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
              Personal Details
            </h3>
          </div>
        }
      >
        <div className="space-y-2">
          <DetailRow
            label="Full Name"
            value={`${employee.firstName} ${employee.lastName}`}
          />

          <DetailRow label="Birth Date" value={formatDate(employee.dob)} />

          <DetailRow label="Gender" value={gender[employee.gender]} />

          <DetailRow label="Email" value={employee.email} />

          <DetailRow label="Phone No." value={employee.phone} />

          <DetailRow
            label="Marital Status"
            value={employee.isMarried ? "Married" : "Single"}
          />

          <DetailRow label="Blood Group" value={employee.bloodGroup} />
        </div>
      </Accordion>
      <Modal
        isOpen={open}
        title={`${employee.firstName} ${employee.lastName}`}
        loading={loading}
        onClose={handleClose}
        handleOnConfirm={handleOnSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white">
          {/* First Name */}
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Enter First Name"
            required
          />

          {/* Last Name */}
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Enter Last Name"
            required
          />

          {/* DOB */}
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            error={errors.dob}
            required
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter Email"
            required
          />

          {/* Phone */}
          <TextField
            label="Phone"
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Enter Phone No."
            required
          />

          {/* Gender */}
          <SelectField
            name="gender"
            label="Gender"
            options={genderOptions}
            value={
              formData.gender
                ? (genderOptions.find((ele) => ele.value === formData.gender) ??
                  "")
                : ""
            }
            placeholder="Select Gender"
            error={errors.gender}
            onChange={(option) =>
              handleChange({
                target: { name: "gender", value: option?.value },
              } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
            }
            isMenuPortalTarget={false}
            required
          />

          {/* Blood Group */}
          <SelectField
            name="bloodGroup"
            label="Blood Group"
            options={bloodGroupOptions}
            value={
              formData.bloodGroup
                ? (bloodGroupOptions.find(
                    (ele) => ele.value === formData.bloodGroup,
                  ) ?? "")
                : ""
            }
            placeholder="Select Blood Group"
            error={errors.bloodGroup}
            onChange={(option) =>
              handleChange({
                target: { name: "bloodGroup", value: option?.value },
              } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
            }
            isMenuPortalTarget={false}
            required
          />

          {/* Marital Status */}
          <SelectField
            name="isMarried"
            label="Marital Status"
            options={maritalStatusOptions}
            value={
              formData.isMarried
                ? (maritalStatusOptions.find(
                    (ele) => ele.value === formData.isMarried,
                  ) ?? "")
                : ""
            }
            placeholder="Select Marital Status"
            error={errors.isMarried}
            onChange={(option) =>
              handleChange({
                target: { name: "isMarried", value: option?.value },
              } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
            }
            isMenuPortalTarget={false}
            required
          />
        </div>
      </Modal>
    </>
  );
};

export default PersonDetails;
