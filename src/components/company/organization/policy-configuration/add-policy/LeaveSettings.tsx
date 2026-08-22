import {
  yesNoOption,
} from "../../../../../constants/constants";
import SelectField from "../../../../common/select/SelectField";
import TextField from "../../../../common/text-field/TextField";
import { PolicyFormData } from "./AddPolicy";

interface LeaveSettingProps {
  data: PolicyFormData;
  handleChange: (
    field: string,
    value: string | number | boolean,
    section?: keyof PolicyFormData,
  ) => void;
  handleLeaveChange: (
    index: number,
    field: keyof PolicyFormData["leaves"][0],
    value: any,
  ) => void;
  editPolicyId?: string;
}

const overtimeOptions = [
  {
    label: "1x",
    value: 1,
  },
  {
    label: "1.5x",
    value: 1.5,
  },
  {
    label: "2x",
    value: 2,
  },
];

const LeaveSetting = ({
  data,
  handleChange,
  handleLeaveChange,
  editPolicyId,
}: LeaveSettingProps) => {
  return (
    <div className="space-y-3">
      {/* Leave Setting */}

      <div>
        <div className=" border-l-4 border-primary bg-primaryBlur px-2 py-2">
          <h3 className="text-md font-medium text-secondary-color">
            Leave Setting
          </h3>
        </div>

        <div className="space-y-3 mt-2  ml-2">
          {data.leaves.map((leave, index) => {
            return (
              <div
                key={leave.leaveId}
                className="grid grid-cols-1 lg:grid-cols-[200px_180px_180px_120px] items-center gap-4"
              >
                <label className="text-sm  font-medium">{leave.name}</label>

                <TextField
                  type="number"
                  value={leave.limit}
                  disabled={!!editPolicyId}
                  onChange={(e) =>
                    handleLeaveChange(index, "limit", Number(e.target.value))
                  }
                />

                <span className="text-sm text-secondary">
                  min hours before apply
                </span>
                <TextField
                  type="number"
                  value={leave.hoursBeforeLeave}
                  disabled={!!editPolicyId}
                  onChange={(e) =>
                    handleLeaveChange(
                      index,
                      "hoursBeforeLeave",
                      Number(e.target.value),
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Continuous Leave */}

      <div className="border-t pt-3">
        <h3 className="mb-5 text-md font-medium text-primary">
          Continuous Leave Setting
        </h3>

        <div className="space-y-3 ml-2">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_180px] items-center gap-4">
            <label className="text-sm text-secondary">
              Back to back dated leave allowed ?
            </label>

            <SelectField
              value={
                data.continuousLeave.enabled
                  ? yesNoOption.find((item) => item.value === "YES")
                  : yesNoOption.find((item) => item.value === "NO")
              }
              options={yesNoOption}
              isDisabled={!!editPolicyId}
              name="enabled"
              onChange={(option) =>
                handleChange(
                  "enabled",
                  option.value === "YES",
                  "continuousLeave",
                )
              }
            />
          </div>

          {data.continuousLeave.enabled && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[320px_180px] items-center gap-4">
                <label className="text-sm text-secondary">
                  Maximum leave days allowed in one request ?
                </label>

                <TextField
                  type="number"
                  value={data.continuousLeave.maxLeaves}
                  disabled={!!editPolicyId}
                  onChange={(e) =>
                    handleChange(
                      "maxLeaves",
                      Number(e.target.value),
                      "continuousLeave",
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[280px_180px] items-center gap-4">
                <label className="text-sm text-secondary">
                  Leave allowed during probation ?
                </label>

                <SelectField
                  value={
                    data.continuousLeave.allowedInProbation
                      ? yesNoOption.find((item) => item.value === "YES")
                      : yesNoOption.find((item) => item.value === "NO")
                  }
                  options={yesNoOption}
                  name="allowedInProbation"
                  isDisabled={!!editPolicyId}
                  onChange={(option) =>
                    handleChange(
                      "allowedInProbation",
                      option.value === "YES",
                      "continuousLeave",
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sandwich Rule Setting */}

      <div className="border-t pt-3">
        <h3 className="mb-5 text-md font-medium text-primary">
          Sandwich Rule Setting
        </h3>

        <div className="space-y-3 ml-2">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_180px] items-center gap-4">
            <label className="text-sm text-secondary">
              Enable sandwich rule ?
            </label>

            <SelectField
              value={
                data.sandwichRule.enabled
                  ? yesNoOption.find((item) => item.value === "YES")
                  : yesNoOption.find((item) => item.value === "NO")
              }
              options={yesNoOption}
              isDisabled={!!editPolicyId}
              name="enabled"
              onChange={(option) =>
                handleChange("enabled", option.value === "YES", "sandwichRule")
              }
            />
          </div>

          {data.sandwichRule.enabled && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[380px_180px] items-center gap-4">
                <label className="text-sm text-secondary">
                  consider also sandwich if leave before and after weekoff ?
                </label>

                <SelectField
                  value={
                    data.sandwichRule.beforeAfterWeekOff
                      ? yesNoOption.find((item) => item.value === "YES")
                      : yesNoOption.find((item) => item.value === "NO")
                  }
                  options={yesNoOption}
                  isDisabled={!!editPolicyId}
                  name="beforeAfterWeekOff"
                  onChange={(option) =>
                    handleChange(
                      "beforeAfterWeekOff",
                      option.value === "YES",
                      "sandwichRule",
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[380px_180px] items-center gap-4">
                <label className="text-sm text-secondary">
                  consider also sandwich if leave before and after holiday ?
                </label>

                <SelectField
                  value={
                    data.sandwichRule.beforeAfterHoliday
                      ? yesNoOption.find((item) => item.value === "YES")
                      : yesNoOption.find((item) => item.value === "NO")
                  }
                  options={yesNoOption}
                  isDisabled={!!editPolicyId}
                  name="beforeAfterHoliday"
                  onChange={(option) =>
                    handleChange(
                      "beforeAfterHoliday",
                      option.value === "YES",
                      "sandwichRule",
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overtime Rule Setting */}

      <div className="border-t pt-3">
        <h3 className="mb-5 text-md font-medium text-primary">
          Overtime Rule Setting
        </h3>

        <div className="space-y-3 ml-2">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_180px] items-center gap-4">
            <label className="text-sm text-secondary">
              Overtime applicable ?
            </label>

            <SelectField
              value={
                data.overtime.enabled
                  ? yesNoOption.find((item) => item.value === "YES")
                  : yesNoOption.find((item) => item.value === "NO")
              }
              options={yesNoOption}
              isDisabled={!!editPolicyId}
              name="enabled"
              onChange={(option) =>
                handleChange("enabled", option.value === "YES", "overtime")
              }
            />
          </div>

          {data.overtime.enabled && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[380px_180px] items-center gap-4">
                <label className="text-sm text-secondary">
                  OT Calculation After how many minutes
                </label>

                <TextField
                  type="number"
                  value={data.overtime.minimumMinutes}
                  name="minimumMinutes"
                  disabled={!!editPolicyId}
                  onChange={(e) =>
                    handleChange(
                      "minimumMinutes",
                      Number(e.target.value),
                      "overtime",
                    )
                  }
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm text-secondary">Overtime rate</label>

                <SelectField
                  value={
                    data.overtime.overtimeRate
                      ? (overtimeOptions.find(
                          (item) => item.value === data.overtime.overtimeRate,
                        ) ?? "")
                      : ""
                  }
                  options={overtimeOptions}
                  isDisabled={!!editPolicyId}
                  name="overtimeRate"
                  onChange={(option) =>
                    handleChange(
                      "overtimeRate",
                      Number(option.value),
                      "overtime",
                    )
                  }
                />
                <label className="text-sm text-secondary">
                  from current salary minute rate
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveSetting;
