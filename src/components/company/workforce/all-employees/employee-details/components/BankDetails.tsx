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
  const initialFormData: IBank = {
    bankName: "",
    accountNo: 0,
    confirmAccountNo: 0,
    ifscCode: "",
    uanNo: "",
    esicNo: "",
    pfJoiningDate: "",
    esicJoiningDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleClickOnEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setOpen((prev) => {
      if (!prev) {
        setFormData({
          bankName: bank.bankName || "",
          accountNo: bank.accountNo || 0,
          confirmAccountNo: bank.accountNo || 0,
          ifscCode: bank.ifscCode || "",
          uanNo: bank.uanNo,
          esicNo: bank.esicNo,
          pfJoiningDate: bank.pfJoiningDate,
          esicJoiningDate: bank.esicJoiningDate,
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

    if (!formData.accountNo) {
      newErrors.accountNo = "Account number is required";
    }

    if (!formData.confirmAccountNo) {
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
    form.append("accountNo", String(formData.accountNo));
    form.append("ifscCode", formData.ifscCode);
    formData.uanNo && form.append("uanNo", formData.uanNo);
    formData.esicNo && form.append("esicNo", formData.esicNo);
    formData.pfJoiningDate &&
      form.append("pfJoiningDate", formData.pfJoiningDate);
    formData.esicJoiningDate &&
      form.append("esicJoiningDate", formData.esicJoiningDate);

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
            <h3 className="text-md text-gray-600 font-medium">Bank Details</h3>
          </div>
        }
      >
        <div className="space-y-2">
          <DetailRow
            label="Bank Name"
            value={bank.bankName ? bank.bankName : "-"}
          />

          <DetailRow label="Account No." value={bank.accountNo} />

          <DetailRow label="IFSC Code" value={bank.ifscCode} />

          <DetailRow label="UAN No." value={bank.uanNo ? bank.uanNo : "-"} />

          <DetailRow label="ESIC No." value={bank.esicNo ? bank.esicNo : "-"} />

          <DetailRow
            label="PF Joining Date"
            value={bank.pfJoiningDate ? formatDate(bank.pfJoiningDate) : "-"}
          />

          <DetailRow
            label="ESIC Joining Date"
            value={
              bank.esicJoiningDate ? formatDate(bank.esicJoiningDate) : "-"
            }
          />
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

        <TextField
          type="date"
          label="PF Joining Date"
          name="pfJoiningDate"
          value={formData.pfJoiningDate}
          onChange={handleChange}
          error={errors.pfJoiningDate}
          max={new Date().toISOString().split("T")[0]}
        />

        <TextField
          type="date"
          label="ESIC Joining Date"
          name="esicJoiningDate"
          value={formData.esicJoiningDate}
          onChange={handleChange}
          error={errors.esicJoiningDate}
          max={new Date().toISOString().split("T")[0]}
        />
        </div>
      </Modal>
    </>
  );
};

export default BankDetails;
