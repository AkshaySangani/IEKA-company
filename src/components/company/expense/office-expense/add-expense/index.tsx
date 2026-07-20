import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../../store/auth-store";
import {
  addOfficeExpense,
  OfficeExpenseFormData,
  VendorDetailsType,
} from "../../../../../apis/expense/office-expense.api";
import {
  ExpenseCategoryEnum,
} from "../../../../../types/common-types";
import { pathNames } from "../../../../../constants/constants";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import PageLoader from "../../../../common/loader/PageLoader";
import ServiceDetails from "./ServiceDetails";
import PaymentDetails from "./PaymentDetails";
import VendorDetails from "./VendorDetails";
import CategoryCards from "./CategoryCards";
import { toastMessage } from "../../../../../utils/toast-message";

const initialFormData: OfficeExpenseFormData = {
  name: "",
  date: "",
  description: "",
  amount: "",
  userId: "",
  branchId: "",

  expenseType: ExpenseCategoryEnum.ELECTRONICS_ITEM,
  serviceType: "",

  paymentMode: "",
  transactionId: "",

  vendor: {
    name: "",
    company: "",
    phone: "",
    isOnWarrenty: false,
    startDate: "",
    endDate: "",
    description: "",
  },

  documents: [],
};
const AddOfficeExpense: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);

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

  const handleVendorChange = (
    field: keyof VendorDetailsType,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      vendor: "",
    }));
  };

  // handle document change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if(files.length > 4){
        toastMessage.success("Maximum 4 Attachment allowed.")
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

    if (!formData.serviceType) {
      newErrors.serviceType = "Service type is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount is required";
    }

    if (!formData.paymentMode) {
      newErrors.paymentMode = "Payment mode is required";
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

      payload.append("userId", formData.userId || user?._id || "");

      payload.append("name", formData.name);

      payload.append("date", formData.date);

      payload.append("amount", String(formData.amount));

      payload.append(
        "expenseType",
        formData.expenseType,
      );

      payload.append("serviceType", formData.serviceType || "");

      payload.append("paymentMode", formData.paymentMode || "");

      payload.append("transactionId", formData.transactionId || "");

      if (formData.description) {
        payload.append("description", formData.description);
      }
      payload.append("vendor", JSON.stringify(formData.vendor));

      formData.documents.forEach((file) => {
        payload.append("documents", file);
      });

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

  return (
    <>
      <TopBar
        title="Add Reimbursements"
        actionButtons={
          <Button
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
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
          <CategoryCards
            active={formData.expenseType}
            setActive={(value: any) => handleChange("expenseType", value)}
          />
          <ServiceDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          <VendorDetails
            formData={formData}
            errors={errors}
            handleChange={handleVendorChange}
          />
          <PaymentDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleDocumentChange={handleDocumentChange}
            removeDocument={removeDocument}
          />
          <div className="mt-4 flex justify-center gap-3 border-t pt-2">
            <Button type="submit" name="Save" size="sm" />
            <Button name="Cancel" variant="secondary" size="sm" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOfficeExpense;
