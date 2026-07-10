import React from "react";
import ImageUpload from "../../../../common/image-upload";
import TextField from "../../../../common/text-field/TextField";
import SelectField from "../../../../common/select/SelectField";
import {
  bloodGroupOptions,
  genderOptions,
  maritalStatusOptions,
  yesNoOption,
} from "../../../../../constants/constants";

interface PersonalDetailsProps {
  formData: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleFileChange: (file: File | null, name: string) => void;
}

const PersonalDetails = ({
  formData,
  errors,
  handleChange,
  handleFileChange,
}: PersonalDetailsProps) => {
  return (
    <div className="bg-transparent p-4">
      <h2 className="text-xl text-white font-semibold mb-6 border-b pb-3">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4">
        {/* Employee Photo */}
        <ImageUpload
          name="employeePhoto"
          onChange={(file) => handleFileChange(file, "employeePhoto")}
          error={errors.employeePhoto}
          label={"Employee Picture"}
          required
        />

        <div />

        <div />

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

        {/* Alternate Phone */}
        <TextField
          label="Alternate Phone"
          name="alternatePhone"
          type="number"
          value={formData.alternatePhone}
          onChange={handleChange}
          error={errors.alternatePhone}
          placeholder="Enter Alternate Phone No."
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
          required
        />

        {/* Physically Disabled */}
        <SelectField
          name="isPhysicallyDisabled"
          label="Physically Disabled"
          options={yesNoOption}
          value={
            formData.isPhysicallyDisabled
              ? (yesNoOption.find(
                  (ele) => ele.value === formData.isPhysicallyDisabled,
                ) ?? "")
              : ""
          }
          placeholder="Select Physically Disabled"
          error={errors.isPhysicallyDisabled}
          onChange={(option) =>
            handleChange({
              target: { name: "isPhysicallyDisabled", value: option?.value },
            } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
          }
          required
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
