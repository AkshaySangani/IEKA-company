// components/policy/AttendanceSettings.tsx

import { yesNoOption } from "../../../../../constants/constants";
import { WEEKLY_OFF_OPTIONS } from "../../../../../constants/options";
import { IOption } from "../../../../../types/common-types";
import Checkbox from "../../../../common/checkbox/CheckBox";
import SelectField from "../../../../common/select/SelectField";
import TextField from "../../../../common/text-field/TextField";
import { PolicyFormData } from "./AddPolicy";

interface Props {
  data: PolicyFormData;

  errors: Record<string, string>;

  handleChange: (
    field: string,
    value: string | number | boolean | string[],
    section?: keyof PolicyFormData,
  ) => void;
  editPolicyId?: string;
}

const percentageOption: IOption[] = [
  { label: "10 %", value: 10 },
  { label: "20 %", value: 20 },
  { label: "30 %", value: 30 },
  { label: "40 %", value: 40 },
  { label: "50 %", value: 50 },
];

const AttendanceSettings = ({
  data,
  errors,
  handleChange,
  editPolicyId,
}: Props) => {
  const handleWeeklyOffChange = (value: string, checked: boolean) => {
    let updatedWeeklyOffs = [...data.workHours.weeklyOffs];

    if (checked) {
      if (!updatedWeeklyOffs.includes(value)) {
        updatedWeeklyOffs.push(value);
      }
    } else {
      updatedWeeklyOffs = updatedWeeklyOffs.filter((item) => item !== value);
    }

    handleChange("weeklyOffs", updatedWeeklyOffs, "workHours");
  };

  return (
    <div className="space-y-3 rounded-lg bg-white shadow-sm">
      {/* Attendance Setting */}

      <div className="border-b pb-4 border-inputBorder">
        <div className="mb-5 border-l-4 border-primary bg-primaryBlur px-2 py-2">
          <h3 className="text-md font-medium text-secondary">
            Attendance Setting
          </h3>
        </div>
        <div className="space-y-3 mt-3">
          <h3 className="text-md font-medium text-primary">
            Weekly Off Settings
          </h3>

          <div className="rounded-md border border-gray-200 bg-white p-5 space-y-4">
            {WEEKLY_OFF_OPTIONS.map((day) => {
              const isSaturday = day.value === "SATURDAY";

              return (
                <div key={day.label} className="">
                  <div className="flex items-start gap-6">
                    <div className="w-32">
                      <p className="text-sm text-secondary">{day.label}</p>
                    </div>

                    {!isSaturday ? (
                      <Checkbox
                        name="weeklyOffs"
                        className="mt-1"
                        checked={data.workHours.weeklyOffs.includes(day.value)}
                        onChange={(checked) =>
                          handleWeeklyOffChange(day.value, checked)
                        }
                        disabled={!!editPolicyId}
                      />
                    ) : (
                      <div className="space-y-1">
                        {day.children?.map((week) => (
                          <div key={week.value} className="flex items-center">
                            <Checkbox
                              name="weeklyOffs"
                              className="mt-1"
                              label={week.label}
                              checked={data.workHours.weeklyOffs.includes(
                                week.value,
                              )}
                              disabled={!!editPolicyId}
                              onChange={(checked) =>
                                handleWeeklyOffChange(week.value, checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Late Mark */}

      <div className="border-b pb-4 border-inputBorder">
        <h3 className="mb-3 text-md font-medium text-primary">
          Late Mark Setting
        </h3>

        <div className="space-y-6 ml-2">
          <div className="flex flex-wrap text-sm text-secondary items-center gap-3">
            <span>Applicable Late Mark if punch in is after</span>

            <div className="w-28">
              <TextField
                type="number"
                value={data.lateRule.allowedLateMinutes}
                error={errors["lateRule.allowedLateMinutes"]}
                disabled={!!editPolicyId}
                onChange={(e) =>
                  handleChange(
                    "allowedLateMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>minutes from shift start or punch out is before</span>

            <div className="w-28">
              <TextField
                type="number"
                value={data.lateRule.allowedEarlyMinutes}
                error={errors["lateRule.allowedEarlyMinutes"]}
                disabled={!!editPolicyId}
                onChange={(e) =>
                  handleChange(
                    "allowedEarlyMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span> minutes from shift end.</span>
          </div>

          <div className="flex flex-wrap text-sm text-secondary items-center gap-3">
            <span>After</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.allowedLateCount}
                error={errors["lateRule.allowedLateCount"]}
                disabled={!!editPolicyId}
                onChange={(e) =>
                  handleChange(
                    "allowedLateCount",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>late marks,</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.onAbsentSlarayDaysCut}
                error={errors["lateRule.onAbsentSlarayDaysCut"]}
                disabled={!!editPolicyId}
                onChange={(e) =>
                  handleChange(
                    "onAbsentSlarayDaysCut",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>day(s) salary will be deducted.</span>
          </div>

          <div className="flex flex-wrap text-sm text-secondary items-center gap-3">
            <span>
              Marked absent if total working shift hours are less than
            </span>

            <div className="w-36">
              <SelectField
                value={
                  data.lateRule.minFullDayPercentage
                    ? percentageOption.find(
                        (ele) =>
                          ele.value === data.lateRule.minFullDayPercentage,
                      )
                    : ""
                }
                name={"minFullDayPercentage"}
                options={percentageOption}
                onChange={(option) =>
                  handleChange(
                    "minFullDayPercentage",
                    Number(option.value),
                    "lateRule",
                  )
                }
                placeholder="Percentage.."
              />
            </div>
          </div>

          <div className="flex flex-wrap text-sm text-secondary items-center gap-3">
            <span>
              Marked half day if total working shift hours are less than
            </span>

            <div className="w-36">
              <SelectField
                value={
                  data.lateRule.minHalfDayPercentage
                    ? percentageOption.find(
                        (ele) =>
                          ele.value === data.lateRule.minHalfDayPercentage,
                      )
                    : ""
                }
                name={"minHalfDayPercentage"}
                options={percentageOption}
                onChange={(option) =>
                  handleChange(
                    "minHalfDayPercentage",
                    Number(option.value),
                    "lateRule",
                  )
                }
                placeholder="Percentage.."
              />
            </div>
          </div>
          {errors["lateRule.minHalfDayPercentage"] && (
            <div className="mt-1 text-xs text-error">
              {errors["lateRule.minHalfDayPercentage"]}
            </div>
          )}
        </div>
      </div>

      {/* Manual Punch */}

      <div className="border-b pb-4 border-inputBorder">
        <h3 className="mb-5 text-md font-medium text-primary">
          Manual Punch Request
        </h3>

        <div className="space-y-2 ml-2">
          <div className="flex items-center text-sm text-secondary gap-4">
            <span>Manual Punch Request?</span>

            <SelectField
              value={
                data?.manualPunch?.enabled
                  ? yesNoOption.find((ele) => ele?.value === "YES")
                  : yesNoOption.find((ele) => ele?.value === "NO")
              }
              isDisabled={!!editPolicyId}
              name={"enabled"}
              options={yesNoOption}
              onChange={(option) =>
                handleChange("enabled", option.value === "YES", "manualPunch")
              }
            />
          </div>

          {data.manualPunch.enabled && (
            <div className="flex flex-wrap text-sm text-secondary items-center gap-3">
              <span>
                How many times employee can request manual punch in a month?
              </span>

              <div className="w-24">
                <TextField
                  type="number"
                  value={data.manualPunch.limit}
                  disabled={!!editPolicyId}
                  error={errors["manualPunch.limit"]}
                  onChange={(e) =>
                    handleChange("limit", Number(e.target.value), "manualPunch")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSettings;
