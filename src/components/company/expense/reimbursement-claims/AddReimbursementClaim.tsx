import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import TextField from "../../../common/text-field/TextField";

import { pathNames } from "../../../../constants/constants";
import PageLoader from "../../../common/loader/PageLoader";

import { IOption } from "../../../../types/common-types";
import SelectField from "../../../common/select/SelectField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import Image from "../../../common/image";
import {
  addReimbursement,
  ReimbursementFormData,
} from "../../../../apis/expense/reimbursement.api";
import { getMyBranchList } from "../../../../apis/organization/branch.api";
import { getManagedEmployee } from "../../../../apis/workforce/all-employee.api";
import { IUser } from ".";
import { useAuthStore } from "../../../../store/auth-store";


const AddReimbursement: React.FC = () => {
  const navigate = useNavigate();
  const {user} = useAuthStore();

  const initialFormData: ReimbursementFormData = {
    name: "",
    date: "",
    description: "",
    amount: "",
    userId: "",
    branchId: "",
    documents: [],
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);

  const [branchList, setBranchList] = useState<IOption[]>([]);
  const [userOptions, setUserOptions] = useState<IOption[]>([]);

  const [formData, setFormData] =
    useState<ReimbursementFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReimbursementFormData, string>>
  >({});

  useEffect(() => {
    fetchBranchList();
  }, []);

  // get branch with shifts
  const fetchBranchList = async () => {
    const response = await getMyBranchList();
    if (response?.success) {
      setBranchList(response.data?.map((ele: any) => ({label: ele?.name, value: ele?.branchId})) || []);
    } else {
      setBranchList([]);
    }
  };

  // handle change values
  const handleChange = (field: keyof ReimbursementFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleBranchChange = async (value: string) => {
    handleChange("branchId", value);
    handleChange("userId", "");
    if(value){
      const response = await getManagedEmployee(value);
      if(response.success){
        setUserOptions(response?.data?.map((ele: IUser) => ({value: ele?._id, label: `${ele?.firstName} ${ele?.lastName}`})))
      } else {
        setUserOptions([]);
      }
    }
  }

  // handle document change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

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
    const newErrors: Partial<Record<keyof ReimbursementFormData, string>> = {};

    if (!formData.branchId.trim()) {
      newErrors.branchId = "Branch is required";
    }

    // if (!formData.userId.trim()) {
    //   newErrors.userId = "Employee is required";
    // }

    if (!formData.name.trim()) {
      newErrors.name = "Expense name is required";
    }

    if (!formData.date) {
      newErrors.date = "Expense date is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount is required";
    }

    // description -> optional
    // documents -> optional

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  //scroll to focus error field
  const scrollToFirstError = (
    errors: Partial<Record<keyof ReimbursementFormData, string>>,
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
      payload.append("userId", formData.userId ? formData.userId : (user?._id??""));
      payload.append("name", formData.name);
      payload.append("date", formData.date);
      payload.append("amount", String(formData.amount));

      if (formData.description) {
        payload.append("description", formData.description);
      }

      formData.documents?.forEach((file) => {
        payload.append("documents", file);
      });

      const response = await addReimbursement(payload);

      if (response.success) {
        navigate(pathNames.REIMBURSEMENT);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(pathNames.DEPARTMENT);
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

      <div className="content-area">
        <PageLoader loading={loading} />
        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:w-[40%] gap-4">
            <SelectField
              label="Branch"
              required
              value={formData.branchId ? branchList?.find(ele => ele?.value === formData.branchId) : ""}
              name={"branchId"}
              options={branchList}
              error={errors.branchId}
              onChange={(option) => handleBranchChange(option.value)}
            />
            <SelectField
              label="Select Employee"
              value={formData.userId ? userOptions?.find(ele => ele.value === formData.userId) : ""}
              name={"userId"}
              options={userOptions}
              error={errors.userId}
              onChange={(option) => handleChange("userId", option.value)}
            />
            <TextField
              label="Expense Name"
              name="name"
              value={formData.name}
              error={errors.name}
              placeholder="Enter expense name"
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Expense Date"
              name="date"
              type="date"
              value={formData.date}
              error={errors.date}
              placeholder="Enter date"
              required
              onChange={(e) => handleChange("date", e.target.value)}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              error={errors.amount}
              placeholder="Enter expense amount"
              required
              onChange={(e) => handleChange("amount", e.target.value)}
            />
            <TextAreaField
              label="Comment"
              name="description"
              value={formData.description}
              error={errors.description}
              placeholder="Enter comments"
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <TextField
              label="Upload Documents"
              name="documents"
              type="file"
              // value={formData.name}
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
          <div className="mt-4 flex justify-center gap-3 border-t pt-2">
            <Button type="submit" name="Save" size="sm" />
            <Button name="Cancel" variant="secondary" size="sm" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReimbursement;
