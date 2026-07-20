import { useEffect, useState } from "react";
import { OfficeExpenseFormData } from "../../../../../apis/expense/office-expense.api";
import SelectField from "../../../../common/select/SelectField";
import TextAreaField from "../../../../common/text-area/TextAreaField";
import TextField from "../../../../common/text-field/TextField";
import { getMyBranchList } from "../../../../../apis/organization/branch.api";
import { IOption } from "../../../../../types/common-types";
import { SERVICE_TYPE_OPTIONS } from "../../../../../constants/options";

interface IServiceDetailsProps {
  formData: OfficeExpenseFormData;
  errors: Partial<Record<keyof OfficeExpenseFormData, string>>;
  handleChange: (field: keyof OfficeExpenseFormData, value: any) => void;
}
export default function ServiceDetails({
  formData,
  errors,
  handleChange,
}: IServiceDetailsProps) {
  const [branchList, setBranchList] = useState<IOption[]>([]);

  useEffect(() => {
    fetchBranchList();
    // eslint-disable-next-line
  }, []);

  // get branch with shifts
  const fetchBranchList = async () => {
    const response = await getMyBranchList();
    if (response?.success) {
      setBranchList(
        response.data?.map((ele: any) => ({
          label: ele?.name,
          value: ele?.branchId,
        })) || [],
      );
    } else {
      setBranchList([]);
    }
  };
  return (
    <div className="content-card p-4">
      <div className="border-b border-inputBorder pb-3 mb-2">
        <span className="text-lg text-primary font-semibold">
          Service Details
        </span>
      </div>
      <div className="grid lg:grid-cols-2 sm:w-[80%] gap-4">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          error={errors.name}
          placeholder="Enter expense name"
          required
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <SelectField
          label="For Branch"
          required
          value={
            formData.branchId
              ? branchList?.find((ele) => ele?.value === formData.branchId)
              : ""
          }
          name={"branchId"}
          options={branchList}
          error={errors.branchId}
          onChange={(option) => handleChange("branchId", option.value)}
        />
        <TextField
          label="Service Date"
          name="date"
          type="date"
          value={formData.date}
          error={errors.date}
          placeholder="Enter date"
          required
          onChange={(e) => handleChange("date", e.target.value)}
        />
        <SelectField
          label="Service Type"
          required
          value={
            formData.serviceType
              ? SERVICE_TYPE_OPTIONS?.find(
                  (ele) => ele?.value === formData.serviceType,
                )
              : ""
          }
          name={"serviceType"}
          options={SERVICE_TYPE_OPTIONS}
          error={errors.serviceType}
          onChange={(option) => handleChange("serviceType", option.value)}
        />
        <TextAreaField
          label="Reason"
          name="description"
          value={formData.description}
          error={errors.description}
          placeholder="Enter reason"
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}
