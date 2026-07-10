import { ColumnDef, CustomTable } from "../../../../common/table";
import TextField from "../../../../common/text-field/TextField";
import Button from "../../../../common/button/Button";
import {
  payValueType,
  payValueTypeOptions,
} from "../../../../../constants/constants";
import { IEarningDetails } from ".";
import SelectField from "../../../../common/select/SelectField";

interface Props {
  earnings: IEarningDetails[];
  errors: any;
  handleEarningChange: (
    index: number,
    field: keyof IEarningDetails,
    value: string | number,
  ) => void;
  addMore: () => void;
  handleRemoveEarning: (index: number) => void;
}

const EarningDetails = ({
  earnings,
  handleEarningChange,
  addMore,
  handleRemoveEarning,
}: Props) => {
  const columns: ColumnDef<IEarningDetails>[] = [
    {
      header: "Earning Name",
      className: "w-[50%] pr-2 pl-2",
      render: (earning, index) => (
        <TextField
          name="name"
          value={earning.name}
          onChange={(e) => handleEarningChange(index, "name", e.target.value)}
          placeholder="Earning Name"
        />
      ),
    },
    {
      header: "Value",
      className: "w-[25%] pr-2 pl-2",
      render: (earning, index) => (
        <TextField
          name="value"
          type="number"
          value={earning.value}
          onChange={(e) => handleEarningChange(index, "value", e.target.value)}
          placeholder="Value"
        />
      ),
    },

    {
      header: `${payValueType.PERCENTAGE} / ${payValueType.FIXED}`,
      className: "w-[20%] pr-2 pl-2",
      render: (earning, index) => (
        <SelectField
          value={
            earning.valueType
              ? (payValueTypeOptions.find(
                  (ele) => ele.value === earning.valueType,
                ) ?? "")
              : ""
          }
          name={"valueType"}
          options={payValueTypeOptions}
          onChange={(option) =>
            handleEarningChange(index, "valueType", option.value)
          }
          placeholder="Value Type"
        />
      ),
    },
    {
      header: "Action",
      className: "w-[5%] pr-0 pl-0",
      render: (_, index) => {
        return (
          <Button
            onClick={() => handleRemoveEarning(index)}
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
        <h2 className="text-md  font-semibold">Earning Details</h2>

        <Button
          type="button"
          name="Add More"
          size="sm"
          onClick={addMore}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <div className={``}>
        <CustomTable columns={columns} data={earnings} />
      </div>
    </div>
  );
};

export default EarningDetails;
