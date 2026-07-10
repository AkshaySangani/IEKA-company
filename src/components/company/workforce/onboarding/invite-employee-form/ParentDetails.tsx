import React from "react";
import TextField from "../../../../common/text-field/TextField";

interface ParentDetailsProps {
  formData: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ParentDetails = ({
  formData,
  errors,
  handleChange,
}: ParentDetailsProps) => {
  return (
    <div className="bg-transparent p-4">
      <h2 className="text-xl text-white font-semibold mb-6 border-b pb-3">
        Parent Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4">
        {/* Father Name */}
        <TextField
          label="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          error={errors.fatherName}
          placeholder="Enter Father Name"
        />

        {/* Father Occupation */}
        <TextField
          label="Father Occupation"
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleChange}
          error={errors.fatherOccupation}
          placeholder="Enter Father Occupation"
        />

        {/* Father Phone */}
        <TextField
          label="Father Phone"
          name="fatherPhone"
          value={formData.fatherPhone}
          onChange={handleChange}
          error={errors.fatherPhone}
          placeholder="Enter Father Phone"
        />

        {/* Mother Name */}
        <TextField
          label="Mother Name"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          error={errors.motherName}
          placeholder="Enter Mother Name"
        />

        {/* Mother Occupation */}
        <TextField
          label="Mother Occupation"
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleChange}
          error={errors.motherOccupation}
          placeholder="Enter Mother Occupation"
        />

        {/* Mother Phone */}
        <TextField
          label="Mother Phone"
          name="motherPhone"
          value={formData.motherPhone}
          onChange={handleChange}
          error={errors.motherPhone}
          placeholder="Enter Mother Phone"
        />
      </div>
    </div>
  );
};

export default ParentDetails;
    