// components/policy/AttendanceSettings.tsx

import { yesNoOption } from "../../../../../constants/constants";
import { WEEKLY_OFF_OPTIONS } from "../../../../../constants/options";
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
}

const AttendanceSettings = ({ data, errors, handleChange }: Props) => {
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
          <h3 className="text-md font-semibold text-secondary-color">
            Attendance Setting
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 w-full lg:w-[70%]">
          <TextField
            type="number"
            label="Total Working Hours / Day"
            value={data.workHours.workingHours}
            error={errors["workHours.workingHours"]}
            onChange={(e) =>
              handleChange("workingHours", Number(e.target.value), "workHours")
            }
          />

          <TextField
            type="number"
            label="Minimum Working Hours For Full Day"
            value={data.workHours.minimumHoursForFullDay}
            error={errors["workHours.minimumHoursForFullDay"]}
            onChange={(e) =>
              handleChange(
                "minimumHoursForFullDay",
                Number(e.target.value),
                "workHours",
              )
            }
          />

          <TextField
            type="number"
            label="Minimum Working Hours For Half Day"
            value={data.workHours.minimumHoursForHalfDay}
            error={errors["workHours.minimumHoursForHalfDay"]}
            onChange={(e) =>
              handleChange(
                "minimumHoursForHalfDay",
                Number(e.target.value),
                "workHours",
              )
            }
          />
        </div>
        <div className="space-y-3 mt-3">
          <h3 className="text-md font-semibold text-primary">
            Weekly Off Settings
          </h3>

          <div className="rounded-md border border-gray-200 bg-white p-5 space-y-4">
            {WEEKLY_OFF_OPTIONS.map((day) => {
              const isSaturday = day.value === "SATURDAY";

              return (
                <div key={day.label} className="">
                  <div className="flex items-start gap-6">
                    <div className="w-32">
                      <p className="text-sm text-grayText">{day.label}</p>
                    </div>

                    {!isSaturday ? (
                      <Checkbox
                        name="weeklyOffs"
                        className="mt-1"
                        checked={data.workHours.weeklyOffs.includes(day.value)}
                        onChange={(checked) =>
                          handleWeeklyOffChange(day.value, checked)
                        }
                      />
                    ) : (
                      <div className="space-y-1">
                        {day.children?.map((week) => (
                          <div
                            key={week.value}
                            className="flex items-center"
                          >
                            <Checkbox
                              name="weeklyOffs"
                              className="mt-1"
                              label={week.label}
                              checked={data.workHours.weeklyOffs.includes(
                                week.value,
                              )}
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
        <h3 className="mb-3 text-md font-semibold text-primary">
          Late Mark Setting
        </h3>

        <div className="space-y-6 ml-2">
          <div className="flex flex-wrap text-sm text-grayText items-center gap-3">
            <span>Applicable Late Mark if punch after</span>

            <div className="w-28">
              <TextField
                type="number"
                value={data.lateRule.graceLoginAfterMinutes}
                error={errors["lateRule.graceLoginAfterMinutes"]}
                onChange={(e) =>
                  handleChange(
                    "graceLoginAfterMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>minutes or before punch</span>

            <div className="w-28">
              <TextField
                type="number"
                value={data.lateRule.graceLoginBeforeMinutes}
                error={errors["lateRule.graceLoginBeforeMinutes"]}
                onChange={(e) =>
                  handleChange(
                    "graceLoginBeforeMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>minutes of shift time.</span>
          </div>

          <div className="flex flex-wrap text-sm text-grayText items-center gap-3">
            <span>If</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.maxGracePerMonth}
                error={errors["lateRule.maxGracePerMonth"]}
                onChange={(e) =>
                  handleChange(
                    "maxGracePerMonth",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>times late marks then cut</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.deductionValue}
                error={errors["lateRule.deductionValue"]}
                onChange={(e) =>
                  handleChange(
                    "deductionValue",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>day salary.</span>
          </div>

          <div className="flex flex-wrap text-sm text-grayText items-center gap-3">
            <span>Absent mark if</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.absentAfterMinutes}
                error={errors["lateRule.absentAfterMinutes"]}
                onChange={(e) =>
                  handleChange(
                    "absentAfterMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>hours less work with total working hours.</span>
          </div>

          <div className="flex flex-wrap text-sm text-grayText items-center gap-3">
            <span>Half day considered if late</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.halfDayAfterMinutes}
                error={errors["lateRule.halfDayAfterMinutes"]}
                onChange={(e) =>
                  handleChange(
                    "halfDayAfterMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>hours and early out</span>

            <div className="w-24">
              <TextField
                type="number"
                value={data.lateRule.halfDayBeforeMinutes}
                error={errors["lateRule.halfDayBeforeMinutes"]}
                onChange={(e) =>
                  handleChange(
                    "halfDayBeforeMinutes",
                    Number(e.target.value),
                    "lateRule",
                  )
                }
              />
            </div>

            <span>hours.</span>
          </div>
        </div>
      </div>

      {/* Manual Punch */}

      <div className="border-b pb-4 border-inputBorder">
        <h3 className="mb-5 text-md font-semibold text-primary">
          Manual Punch Request
        </h3>

        <div className="space-y-2 ml-2">
          <div className="flex items-center text-sm text-grayText gap-4">
            <span>Manual Punch Request?</span>

            <SelectField
              value={
                data?.manualPunch?.enabled
                  ? yesNoOption.find((ele) => ele?.value === "YES")
                  : yesNoOption.find((ele) => ele?.value === "NO")
              }
              name={"enabled"}
              options={yesNoOption}
              onChange={(option) =>
                handleChange("enabled", option.value === "YES", "manualPunch")
              }
            />
          </div>

          {data.manualPunch.enabled && (
            <div className="flex flex-wrap text-sm text-grayText items-center gap-3">
              <span>
                How many times employee can request manual punch in a month?
              </span>

              <div className="w-24">
                <TextField
                  type="number"
                  value={data.manualPunch.limit}
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
