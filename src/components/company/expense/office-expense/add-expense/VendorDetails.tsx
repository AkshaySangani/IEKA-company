import {
  OfficeExpenseFormData,
  VendorDetailsType,
} from "../../../../../apis/expense/office-expense.api";
import { yesNoOption } from "../../../../../constants/constants";
import { ExpenseCategoryEnum } from "../../../../../types/common-types";
import SelectField from "../../../../common/select/SelectField";
import TextAreaField from "../../../../common/text-area/TextAreaField";
import TextField from "../../../../common/text-field/TextField";

interface IVendorDetailsProps {
  formData: OfficeExpenseFormData;
  errors: Partial<Record<keyof OfficeExpenseFormData, string>>;
  handleChange: (field: keyof VendorDetailsType, value: any) => void;
}
export default function VendorDetails({
  formData,
  errors,
  handleChange,
}: IVendorDetailsProps) {
  return (
    <div className="content-card p-4">
      <div className="border-b border-inputBorder pb-3 mb-2">
        <span className="text-lg text-primary font-semibold">
          Vendor Details
        </span>
      </div>
      <div className="grid lg:grid-cols-2 sm:w-[80%] gap-4">
        <TextField
          label="Vendor Company Name"
          name="name"
          value={formData.vendor.company}
          placeholder="Enter vendor company name"
          onChange={(e) => handleChange("company", e.target.value)}
        />
        {formData.expenseType !==
          ExpenseCategoryEnum.BILL_AND_SUBSCRIPTIONS && (
          <div className="grid lg:grid-cols-2 gap-4">
            <TextField
              label="Person Name"
              name="name"
              value={formData.vendor.name}
              placeholder="Enter person name"
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Person Phone"
              name="name"
              type="number"
              value={formData.vendor.phone}
              placeholder="Enter person phone"
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        )}
        {((formData.expenseType === ExpenseCategoryEnum.ELECTRONICS_ITEM) ||
          (formData.expenseType === ExpenseCategoryEnum.MACHINERY_AND_TOOLS)) && (
            <>
              <SelectField
                label="Guarantee / Warranty ?"
                value={{value: formData.vendor.isOnWarrenty ? "YES" : "NO", label: formData.vendor.isOnWarrenty ? "Yes" : "No"}}
                name={"isOnWarrenty"}
                options={yesNoOption}
                onChange={(option) =>
                  handleChange("isOnWarrenty", option.value === "YES")
                }
              />
              <div className="grid lg:grid-cols-2 gap-4">
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.vendor.startDate}
                  placeholder="Enter start date"
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.vendor.endDate}
                  placeholder="Enter date"
                  min={formData.vendor.startDate}
                  disabled={!formData.vendor.startDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </>
          )}

        <TextAreaField
          label="Reason"
          name="description"
          value={formData.vendor.description}
          error={errors.description}
          placeholder="Enter comments"
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}
