import { IIncomeTaxDeductionDetails } from ".";
import {
  payValueType,
  payValueTypeOptions,
} from "../../../../constants/constants";
import Button from "../../../common/button/Button";
import SelectField from "../../../common/select/SelectField";
import { ColumnDef, CustomTable } from "../../../common/table";
import TextField from "../../../common/text-field/TextField";

interface Props {
  deductions: IIncomeTaxDeductionDetails[];
  errors: any;
  handleIncomeTaxDeductionChange: (
    index: number,
    field: keyof IIncomeTaxDeductionDetails,
    value: string | number,
  ) => void;
  addMore: (key: "incomeDetails") => void;
  handleRemoveDeduction: (index: number, key: "incomeDetails") => void;
}

const IncomeTaxDeductionDetails = ({
  deductions,
  handleIncomeTaxDeductionChange,
  addMore,
  handleRemoveDeduction,
}: Props) => {
  const columns: ColumnDef<IIncomeTaxDeductionDetails>[] = [
    {
      header: "Income From",
      className: "w-[50%] pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="from"
          type="number"
          value={deduction.from}
          onChange={(e) =>
            handleIncomeTaxDeductionChange(index, "from", e.target.value)
          }
          placeholder="Income From"
        />
      ),
    },
    {
      header: "Income To",
      className: "w-[20%] pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="to"
          type="number"
          value={deduction.to}
          onChange={(e) =>
            handleIncomeTaxDeductionChange(index, "to", e.target.value)
          }
          placeholder="Income To"
        />
      ),
    },

    {
      header: `Tax Rate (%)`,
      className: "w-[20%] pr-2 pl-2",
      render: (deduction, index) => (
        <TextField
          name="taxRate"
          type="number"
          value={deduction.taxRate}
          onChange={(e) =>
            handleIncomeTaxDeductionChange(index, "taxRate", e.target.value)
          }
          placeholder="Tax rate (%)"
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
            onClick={() => handleRemoveDeduction(index, "incomeDetails")}
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
        <h2 className="text-md  font-semibold">Income Tax Deduction Details</h2>

        <Button
          type="button"
          name="Add More"
          size="sm"
          onClick={() => addMore("incomeDetails")}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <div className={``}>
        <CustomTable columns={columns} data={deductions} />
      </div>
    </div>
  );
};

export default IncomeTaxDeductionDetails;
