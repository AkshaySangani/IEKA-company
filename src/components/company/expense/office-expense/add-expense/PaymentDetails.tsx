import { OfficeExpenseFormData } from "../../../../../apis/expense/office-expense.api";
import { PAYMENT_MODE_OPTIONS } from "../../../../../constants/options";
import Image from "../../../../common/image";
import SelectField from "../../../../common/select/SelectField";
import TextField from "../../../../common/text-field/TextField";

interface IPaymentDetailsProps {
  formData: OfficeExpenseFormData;
  errors: Partial<Record<keyof OfficeExpenseFormData, string>>;
  handleDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (field: keyof OfficeExpenseFormData, value: string) => void;
  removeDocument: (index: number) => void;
}
export default function PaymentDetails({
  formData,
  errors,
  handleDocumentChange,
  handleChange,
  removeDocument,
}: IPaymentDetailsProps) {
  return (
    <div className="content-card p-4">
      <div className="border-b border-inputBorder pb-3 mb-2">
        <span className="text-lg text-primary font-semibold">
          Payment Details
        </span>
      </div>
      <div className="grid lg:grid-cols-2 sm:w-[80%] gap-3">
        <TextField
          label="Total Amount"
          placeholder="Enter Amount"
          required
          value={formData.amount}
          name={"amount"}
          error={errors.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
        />
        <SelectField
          label="Payment Mode"
          value={
            formData.paymentMode
              ? (PAYMENT_MODE_OPTIONS.find(
                  (ele) => ele.value === formData.paymentMode,
                ) ?? "")
              : ""
          }
          name={"paymentMode"}
          options={PAYMENT_MODE_OPTIONS}
          error={errors.paymentMode}
          required
          onChange={(option) => handleChange("paymentMode", option.value)}
        />
        <TextField
          label="Transaction Id"
          name="transactionId"
          value={formData.transactionId}
          error={errors.transactionId}
          placeholder="Enter Transaction Id"
          onChange={(e) => handleChange("transactionId", e.target.value)}
        />
        <TextField
          label="Upload Attachments"
          name="documents"
          type="file"
          multiple
          placeholder="Upload Documents"
          onChange={(e) => handleDocumentChange(e)}
        />

        <div />
        
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {formData.documents?.length > 0 &&
            formData.documents.map((file, index) => (
              <div
                key={index}
                className="content-card flex flex-col justify-between gap-1 p-2 relative"
              >
                <div className="absolute top-0 right-0 z-10 px-1 bg-danger cursor-pointer border border-white">
                  <i
                    className="fa-solid fa-xmark fa-lg text-white"
                    onClick={() => removeDocument(index)}
                  />
                </div>
                <Image
                  src={URL.createObjectURL(file)}
                  height={300}
                  alt={file.name}
                />
                <span>{file.name}</span>
              </div>
            ))}
        </div>
    </div>
  );
}
