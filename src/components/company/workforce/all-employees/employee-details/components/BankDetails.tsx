import { useState } from "react";
import DetailRow from "../../../../../common/detail-row";
import Accordion from "../../../../../common/accordian";
import Modal from "../../../../../common/modal/Modal";
import TextField from "../../../../../common/text-field/TextField";
import { IBank } from "../../../onboarding/employee-details";
import { formatDate } from "../../../../../../utils/date-format";

interface BankDetailsProps {
  bank: IBank;
  loading: boolean;
  handleSubmit: (formData: FormData) => void;
}

const BankDetails = ({ bank, loading, handleSubmit }: BankDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const initialFormData = {
    bankName: "",
    accountNo: "",
    confirmAccountNo: "",
    ifscCode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleClickOnEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setOpen((prev) => {
      if (!prev) {
        setFormData({
          bankName: bank.bankName || "",
          accountNo: String(bank.accountNo) || "",
          confirmAccountNo: String(bank.accountNo) || "",
          ifscCode: bank.ifscCode || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: typeof initialFormData) => ({
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

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!formData.accountNo.trim()) {
      newErrors.accountNo = "Account number is required";
    }

    if (!formData.confirmAccountNo.trim()) {
      newErrors.confirmAccountNo = "Confirm account number is required";
    }

    if (
      formData.accountNo &&
      formData.confirmAccountNo &&
      formData.accountNo !== formData.confirmAccountNo
    ) {
      newErrors.confirmAccountNo = "Account numbers do not match";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async () => {
    if (!validate()) return;

    const form = new FormData();

    form.append("bankName", formData.bankName);
    form.append("accountNo", formData.accountNo);
    form.append("ifscCode", formData.ifscCode);

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
              Bank Details
            </h3>
          </div>
        }
      >
        <div className="space-y-2">
          <DetailRow label="Bank Name" value={bank.bankName?bank.bankName:"-"} />

          <DetailRow label="Account No." value={bank.accountNo} />

          <DetailRow label="IFSC Code" value={bank.ifscCode} />

          <DetailRow label="UAN No." value={bank.uanNo?bank.uanNo:"-"} />

          <DetailRow label="ESIC No." value={bank.esicNo?bank.esicNo:"-"} />

          <DetailRow label="PF Joining Date" value={bank.pfJoiningDate? formatDate(bank.pfJoiningDate):"-"} />

          <DetailRow label="ESIC Joining Date" value={bank.esicJoiningDate? formatDate(bank.esicJoiningDate):"-"} />
        </div>
      </Accordion>
      <Modal
        isOpen={open}
        title={"Bank Details"}
        loading={loading}
        onClose={handleClose}
        handleOnConfirm={handleOnSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white">
          {/* First Name */}
          <TextField
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            error={errors.bankName}
            placeholder="Enter Bank Name"
            required
          />

          <TextField
            label="Account Number"
            type="number"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleChange}
            error={errors.accountNo}
            placeholder="Enter Account Number"
            required
          />

          <TextField
            label="Confirm Account Number"
            type="number"
            name="confirmAccountNo"
            value={formData.confirmAccountNo}
            onChange={handleChange}
            error={errors.confirmAccountNo}
            placeholder="Confirm Account Number"
            required
          />

          <TextField
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            error={errors.ifscCode}
            required
            placeholder="Enter IFSC Code"
          />
        </div>
      </Modal>
    </>
  );
};

export default BankDetails;
