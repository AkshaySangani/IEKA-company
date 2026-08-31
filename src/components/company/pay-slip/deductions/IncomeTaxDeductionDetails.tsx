import { DeductionFormData, IIncomeTaxDeductionDetails } from ".";
import Button from "../../../common/button/Button";
import { ColumnDef, CustomTable } from "../../../common/table";
import TextField from "../../../common/text-field/TextField";

interface Props {
  deductions: IIncomeTaxDeductionDetails[];
  errors: Partial<Record<keyof DeductionFormData, string>>;
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
  errors,
  handleIncomeTaxDeductionChange,
  addMore,
  handleRemoveDeduction,
}: Props) => {
  const columns: ColumnDef<IIncomeTaxDeductionDetails>[] = [
    {
      header: "Income From",
      className: "pr-2 pl-2",
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
      className: "pr-2 pl-2",
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
      className: "pr-2 pl-2",
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
      className: "pr-0 pl-0",
      render: (_, index) => {
        return (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveDeduction(index, "incomeDetails");
            }}
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
        <h2 className="text-md  font-medium">Income Tax Deduction Details</h2>

        <Button
          type="button"
          name="Add More"
          size="sm"
          onClick={() => addMore("incomeDetails")}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <CustomTable columns={columns} data={deductions} />
      {errors.incomeDetails && (
        <p className="mt-1 text-xs text-error">{errors.incomeDetails}</p>
      )}
    </div>
  );
};

export default IncomeTaxDeductionDetails;
