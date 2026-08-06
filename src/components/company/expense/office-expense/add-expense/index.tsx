import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../../store/auth-store";
import {
  addOfficeExpense,
  OfficeExpenseFormData,
  VendorDetailsType,
} from "../../../../../apis/expense/office-expense.api";
import { ExpenseCategoryEnum } from "../../../../../types/common-types";
import { pathNames } from "../../../../../constants/constants";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import PageLoader from "../../../../common/loader/PageLoader";
import ServiceDetails from "./ServiceDetails";
import PaymentDetails from "./PaymentDetails";
import { toastMessage } from "../../../../../utils/toast-message";
import ActionModal from "../../../../common/modal/ActionModal";

const initialFormData: OfficeExpenseFormData = {
  name: "",
  date: "",
  description: "",
  amount: "",
  branchId: "",

  paymentMode: "",
  transactionId: "",

  documents: [],
};
const AddOfficeExpense: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [actionOpen, setActionOpen] = useState<boolean>(false);

  const [formData, setFormData] =
    useState<OfficeExpenseFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof OfficeExpenseFormData, string>>
  >({});

  // handle change values
  const handleChange = (field: keyof OfficeExpenseFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // handle document change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      toastMessage.success("Maximum 4 Attachment allowed.");
      return;
    }
    setFormData((prev) => {
      const existingNames = new Set(
        prev.documents.map((file) => `${file.name}-${file.size}`),
      );

      const newFiles = files.filter(
        (file) => !existingNames.has(`${file.name}-${file.size}`),
      );

      return {
        ...prev,
        documents: [...prev.documents, ...newFiles],
      };
    });

    e.target.value = "";
    setErrors((prev) => ({
      ...prev,
      ["documents"]: "",
    }));
  };

  // remove document
  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // handle validate fields
  const validate = () => {
    const newErrors: Partial<Record<keyof OfficeExpenseFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Expense name is required";
    }

    if (!formData.branchId.trim()) {
      newErrors.branchId = "Branch is required";
    }

    if (!formData.date) {
      newErrors.date = "Service Date is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount is required";
    }

    if (!formData.paymentMode) {
      newErrors.paymentMode = "Payment mode is required";
    }

    if (formData.documents?.length === 0) {
      newErrors.documents = "Attachments are required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  //scroll to focus error field
  const scrollToFirstError = (
    errors: Partial<Record<keyof OfficeExpenseFormData, string>>,
  ) => {
    const firstErrorKey = Object.keys(errors)[0];

    if (!firstErrorKey || !formRef.current) return;

    const field =
      formRef.current.querySelector(`[name="${firstErrorKey}"]`) ||
      (document.getElementById(`field-${firstErrorKey}`) as HTMLElement | null);

    if (field) {
      field.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        if ("focus" in field) {
          (field as HTMLElement).focus();
        }
      }, 300);
    }
  };

  // handle submit for Save and Update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("branchId", formData.branchId);

      payload.append("name", formData.name);

      payload.append("date", formData.date);

      payload.append("amount", String(formData.amount));

      payload.append("paymentMode", formData.paymentMode || "");

      payload.append("transactionId", formData.transactionId || "");

      if (formData.description) {
        payload.append("description", formData.description);
      }

      if (formData.documents?.length > 0) {
        formData.documents.forEach((file) => {
          payload.append("documents", file);
        });
      }

      const response = await addOfficeExpense(payload);

      if (response.success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(pathNames.OFFICE_EXPENSE);
  };

  const handleAction = () => {
    if (!validate()) return;
    setActionOpen((prev) => !prev);
  };

  const handleOnConfirm = async () => {
    await formRef.current?.requestSubmit();
  };

  return (
    <>
      <TopBar
        title="Add Expense"
        actionButtons={
          <div className="flex gap-2">
            <Button name="Action" size="sm" onClick={handleAction} />
            <Button
              size="sm"
              variant={"danger"}
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
            />
          </div>
        }
      />

      <div className="content-area bg-primaryBlur">
        <PageLoader loading={loading} />
        <form
          className="flex flex-col gap-3"
          ref={formRef}
          method="POST"
          onSubmit={handleSubmit}
        >
          <ServiceDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          <PaymentDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleDocumentChange={handleDocumentChange}
            removeDocument={removeDocument}
          />
        </form>
      </div>
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to add this expense?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
};

export default AddOfficeExpense;
