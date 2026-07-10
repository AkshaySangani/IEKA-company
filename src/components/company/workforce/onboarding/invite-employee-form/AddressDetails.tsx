import React from "react";
import TextField from "../../../../common/text-field/TextField";

interface AddressDetailsProps {
  formData: any;
  errors: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const AddressDetails = ({
  formData,
  errors,
  handleChange,
}: AddressDetailsProps) => {
  return (
    <div className="bg-transparent p-4">
      <h2 className="text-xl text-white font-semibold mb-6 border-b pb-3">
        Address Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4">
        {/* Current Address */}
        <TextField
          label="Current Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Enter Current Address"
          required
        />

        {/* Permanent Address */}
        <TextField
          label="Permanent Address"
          name="permanentAddress"
          value={formData.permanentAddress}
          onChange={handleChange}
          error={errors.permanentAddress}
          placeholder="Enter Permanent Address"
          required
        />
      </div>

      {/* Copy Address Checkbox */}
      {/* <div className="mt-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.address === formData.permanentAddress}
            onChange={(e) => {
              if (e.target.checked) {
                handleChange({
                  target: {
                    name: "permanentAddress",
                    value: formData.address,
                  },
                } as React.ChangeEvent<HTMLTextAreaElement>);
              } else {
                handleChange({
                  target: {
                    name: "permanentAddress",
                    value: "",
                  },
                } as React.ChangeEvent<HTMLTextAreaElement>);
              }
            }}
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-600">
            Same as Current Address
          </span>
        </label>
      </div> */}
    </div>
  );
};

export default AddressDetails;