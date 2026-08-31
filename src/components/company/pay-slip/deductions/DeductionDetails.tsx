import { DeductionFormData, IDeductionDetails } from ".";
import {
  payValueType,
  payValueTypeOptions,
} from "../../../../constants/constants";
import { deductionEnum } from "../../../../types/common-types";
import Button from "../../../common/button/Button";
import SelectField from "../../../common/select/SelectField";
import { ColumnDef, CustomTable } from "../../../common/table";
import TextField from "../../../common/text-field/TextField";

interface Props {
  deductions: IDeductionDetails[];
  errors: Partial<Record<keyof DeductionFormData, string>>;
  handleDeductionChange: (
    index: number,
    field: keyof IDeductionDetails,
    value: string | number,
  ) => void;
  addMore: (key: "details") => void;
  handleRemoveDeduction: (index: number, key: "details") => void;
}

// define default deduction types
const deductionTypes: string[] = [
  deductionEnum.PROFESSIONAL_TAX,
  deductionEnum.PROVIDENT_FUND,
  deductionEnum.ESIC,
];

const DeductionDetails = ({
  deductions,
  errors,
  handleDeductionChange,
  addMore,
  handleRemoveDeduction,
}: Props) => {
  const columns: ColumnDef<IDeductionDetails>[] = [
    {
      header: "Deduction",
      className: " pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="name"
          value={deduction.name}
          onChange={(e) => handleDeductionChange(index, "name", e.target.value)}
          placeholder="Deduction"
          disabled={deductionTypes.includes(deduction.name)}
        />
      ),
    },
    {
      header: "Value",
      className: "pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="value"
          type="number"
          value={deduction.value}
          onChange={(e) =>
            handleDeductionChange(index, "value", e.target.value)
          }
          placeholder="Value"
        />
      ),
    },

    {
      header: `${payValueType.PERCENTAGE} / ${payValueType.FIXED}`,
      className: "pr-2 pl-2",
      render: (deduction, index) => (
        <SelectField
          value={
            deduction.valueType
              ? (payValueTypeOptions.find(
                  (ele) => ele.value === deduction.valueType,
                ) ?? "")
              : ""
          }
          name={"valueType"}
          options={payValueTypeOptions}
          onChange={(option) =>
            handleDeductionChange(index, "valueType", option.value)
          }
          placeholder="Value Type"
        />
      ),
    },
    {
      header: "Action",
      className: "pr-0 pl-0",
      render: (deduction, index) => {
        return !deductionTypes.includes(deduction.name) ? (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveDeduction(index, "details");
            }}
            variant="danger"
            size="sm"
            leftIcon={<i className="fa-solid text-secondary fa-xmark"></i>}
          />
        ) : (
          <></>
        );
      },
    },
  ];
  return (
    <div className="bg-transparent">
      <div className="flex items-center justify-between border-b border-secondary pb-3 mb-2">
        <h2 className="text-md  font-medium">Deduction Details</h2>

        <Button
          type="button"
          name="Add More"
          size="sm"
          onClick={() => addMore("details")}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>
      <CustomTable columns={columns} data={deductions} />
      {errors.details && (
        <p className="mt-1 text-xs text-error">{errors.details}</p>
      )}
    </div>
  );
};

export default DeductionDetails;
