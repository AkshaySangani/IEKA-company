import { IDeductionDetails } from ".";
import {
  payValueType,
  payValueTypeOptions,
} from "../../../../constants/constants";
import Button from "../../../common/button/Button";
import SelectField from "../../../common/select/SelectField";
import { ColumnDef, CustomTable } from "../../../common/table";
import TextField from "../../../common/text-field/TextField";

interface Props {
  deductions: IDeductionDetails[];
  errors: any;
  handleDeductionChange: (
    index: number,
    field: keyof IDeductionDetails,
    value: string | number,
  ) => void;
  addMore: (key: "details") => void;
  handleRemoveDeduction: (index: number, key: "details") => void;
}

const DeductionDetails = ({
  deductions,
  handleDeductionChange,
  addMore,
  handleRemoveDeduction,
}: Props) => {
  const columns: ColumnDef<IDeductionDetails>[] = [
    {
      header: "Deduction",
      className: "w-[50%] pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="name"
          value={deduction.name}
          onChange={(e) => handleDeductionChange(index, "name", e.target.value)}
          placeholder="Deduction"
        />
      ),
    },
    {
      header: "Value",
      className: "w-[20%] pr-2 pl-2",
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
      className: "w-[20%] pr-2 pl-2",
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
      className: "w-[10%] pr-0 pl-0",
      render: (_, index) => {
        return (
          <Button
            type="button"
            onClick={() => handleRemoveDeduction(index, "details")}
            variant="danger"
            size="sm"
            leftIcon={<i className="fa-solid text-secondary fa-xmark"></i>}
          />
        );
      },
    },
  ];
  return (
    <div className="bg-transparent">
      <div className="flex items-center justify-between border-b border-secondary pb-3 mb-2">
        <h2 className="text-md  font-semibold">Deduction Details</h2>

        <Button
          type="button"
          name="Add More"
          size="sm"
          onClick={() => addMore("details")}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <div className={``}>
        <CustomTable columns={columns} data={deductions} />
      </div>
    </div>
  );
};

export default DeductionDetails;
