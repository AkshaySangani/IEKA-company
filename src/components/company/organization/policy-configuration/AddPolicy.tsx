import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import {
  addPolicy,
  updatePolicy,
} from "../../../../apis/organization/policy.api";
import { IPolicy } from ".";
import { getDateDifferenceInDays } from "../../../../utils/date-format";
import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import PageLoader from "../../../common/loader/PageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { pathNames } from "../../../../constants/constants";

interface PolicyFormData {
  name: string;
}

const AddPolicy: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const location  = useLocation();
  const policy = location?.state;
  const initialFormData: PolicyFormData = {
    name: "",
  };

  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PolicyFormData, string>>
  >({});

  // useEffect(() => {
  //   if (holiday?._id) {
  //     // setFormData({
  //     //   name: holiday.name,
  //     //   description: holiday.description,
  //     //   effectiveYear: holiday.effectiveYear,
  //     //   startDate: holiday.startDate.split("T")[0],
  //     //   endDate: holiday.endDate.split("T")[0],
  //     // });
  //   } else {
  //     setFormData(initialFormData);
  //   }
  //   // eslint-disable-next-line
  // }, [holiday]);

  const handleChange = (
    field: keyof PolicyFormData,
    value: string | number,
  ) => {
    validate();
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof PolicyFormData, string>> = {};


    if (!formData.name.trim()) {
      newErrors.name = "Policy name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const response = policy?.id
      ? await updatePolicy(formData, policy.id)
      : await addPolicy(formData);

    if (response.success) {
    resetForm();
    handleClose();
    }

    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    navigate(pathNames.POLICY_CONFIGURATION)
  };

  return (
    <>
      <TopBar
        title="Add Policy"
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
          <div className="grid grid-cols-1 w-[75%] gap-4">
            <TextField
              label="Policy Name"
              required
              value={formData.name}
              error={errors.name}
              placeholder="Enter policy name"
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <Button type="submit" name="Save" size="sm" />
            <Button name="Cancel" variant="secondary" size="sm" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPolicy;
