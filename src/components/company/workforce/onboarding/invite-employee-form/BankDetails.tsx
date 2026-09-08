import React from "react";
import TextField from "../../../../common/text-field/TextField";
import DatePickerField from "../../../../common/date-picker/DatePicker";

interface BankDetailsProps {
  formData: any;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (
    name: "pfJoiningDate" | "esicJoiningDate",
    value: string,
  ) => void;
}

const BankDetails = ({
  formData,
  errors,
  handleChange,
  handleDateChange,
}: BankDetailsProps) => {
  return (
    <div className="bg-transparent p-4">
      <h2 className="text-xl text-white font-medium mb-6 border-b pb-3">
        Bank Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white p-4">
        {/* Account Holder Name */}
        <TextField
          label="Account Holder Name"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          error={errors.accountHolderName}
          placeholder="Enter Account Holder Name"
        />

        {/* Bank Name */}
        <TextField
          label="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          error={errors.bankName}
          placeholder="Enter Bank Name"
        />

        {/* Branch Name */}
        <TextField
          label="Branch Name"
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
          error={errors.branchName}
          placeholder="Enter Branch Name"
        />

        {/* Account Number */}
        <TextField
          label="Account Number"
          name="accountNo"
          type="number"
          value={formData.accountNo}
          onChange={handleChange}
          error={errors.accountNo}
          placeholder="Enter Account Number"
        />

        {/* Confirm Account Number */}
        <TextField
          label="Confirm Account Number"
          name="confirmAccountNo"
          type="number"
          value={formData.confirmAccountNo}
          onChange={handleChange}
          error={errors.confirmAccountNo}
          placeholder="Enter Confirm Account Number"
        />

        {/* IFSC */}
        <TextField
          label="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          error={errors.ifscCode}
          placeholder="Enter IFSC Code"
        />

        <TextField
          label="UAN No. (if Applicable)"
          name="uanNo"
          value={formData.uanNo}
          onChange={handleChange}
          error={errors.uanNo}
          placeholder="Enter UAN No."
        />

        <TextField
          label="ESIC No (if Applicable)"
          name="esicNo"
          value={formData.esicNo}
          onChange={handleChange}
          error={errors.esicNo}
          placeholder="Enter ESIC No."
        />

        <DatePickerField
          label="PF Joining Date"
          name="pfJoiningDate"
          value={formData.pfJoiningDate}
          error={errors.pfJoiningDate}
          onChange={(date: string): void =>
            handleDateChange("pfJoiningDate", date)
          }
          maxDate={new Date()}
        />

        <DatePickerField
          label="ESIC Joining Date"
          name="esicJoiningDate"
          value={formData.esicJoiningDate}
          error={errors.esicJoiningDate}
          onChange={(date: string): void =>
            handleDateChange("esicJoiningDate", date)
          }
          maxDate={new Date()}
        />
      </div>
    </div>
  );
};

export default BankDetails;
