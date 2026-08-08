import { useEffect, useRef, useState } from "react";
import { useNavigate} from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import PageLoader from "../../../common/loader/PageLoader";
import SelectField from "../../../common/select/SelectField";
import DateRangePicker from "../../../common/date-picker/DateRangePicker";

import { pathNames } from "../../../../constants/constants";

import {
  addLeaveRequest,
  LeaveFormData,
} from "../../../../apis/performance/leave-request.api";

import {
  IOption,
  LeaveDuration,
  statusEnum,
} from "../../../../types/common-types";

import { getBranchShiftDepartment } from "../../../../apis/workforce/onboardings.api";

import {
  IBranch,
} from "../../workforce/onboarding/assign-roles-responsibility";
import TextAreaField from "../../../common/text-area/TextAreaField";
import { getLeaves } from "../../../../apis/organization/leave.api";
import { ILeave } from "../../organization/leave";
import ActionModal from "../../../common/modal/ActionModal";
import { IUser } from "../attendance";
import { getManagedEmployee } from "../../../../apis/workforce/all-employee.api";
import { DateFormat, formatDate } from "../../../../utils/date-format";

/* -------------------------------------------------------------------------- */
/*                             INITIAL FORM DATA                              */
/* -------------------------------------------------------------------------- */

const initialFormData: LeaveFormData = {
  userId: "",
  leaveId: "",
  startDate: "",
  endDate: "",
  duration: LeaveDuration.FULL_DAY,
  reason: "",
};

/* -------------------------------------------------------------------------- */
/*                            DURATION OPTIONS                                */
/* -------------------------------------------------------------------------- */

const durationOptions: IOption[] = [
  {
    label: "Full Day",
    value: LeaveDuration.FULL_DAY,
  },
  {
    label: "First Half",
    value: LeaveDuration.FIRST_HALF,
  },
  {
    label: "Second Half",
    value: LeaveDuration.SECOND_HALF,
  },
];

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

const AddLeaveRequest: React.FC = () => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  /* ------------------------------------------------------------------------ */
  /*                                STATES                                    */
  /* ------------------------------------------------------------------------ */

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  // action state for show confirmation popup
  const [actionOpen, setActionOpen] = useState<boolean>(false);

  /**
   * Branch / Shift are only used for filtering employees.
   * They are NOT part of the API payload.
   */
  const [branchId, setBranchId] = useState("");

  const [branchOptions, setBranchOptions] = useState<IOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<IOption[]>([]);
  const [leaveOptions, setLeaveOptions] = useState<IOption[]>([]);

  /**
   * Main form state.
   *
   * This directly represents the API payload.
   */
  const [formData, setFormData] = useState<LeaveFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LeaveFormData, string>>
  >({});

  /* ------------------------------------------------------------------------ */
  /*                              INITIAL LOAD                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchBranchList();
  }, []);

  // useEffect(() => {
  //   if (leaveId) {
  //     fetchLeaveRequestById(leaveId);
  //   }
  // }, [leaveId]);

  // /* ------------------------------------------------------------------------ */
  // /*                         FETCH EXISTING REQUEST                            */
  // /* ------------------------------------------------------------------------ */

  // const fetchLeaveRequestById = async (id: string) => {
  //   try {
  //     setLoading(true);

  //     /**
  //      * Uncomment when your API is ready.
  //      *
  //      * Example expected response:
  //      *
  //      * {
  //      *   userId: "...",
  //      *   leaveId: "...",
  //      *   startDate: "...",
  //      *   endDate: "...",
  //      *   duration: "FULL_DAY",
  //      *   reason: "..."
  //      * }
  //      */

  //     const response = await getLeaveRequestById(id);

  //     if (response?.success && response?.data) {
  //       const data = response.data;

  //       setFormData({
  //         userId: data.userId ?? "",
  //         leaveId: data.leaveId ?? "",
  //         startDate: data.startDate ?? "",
  //         endDate: data.endDate ?? "",
  //         duration: data.duration ?? "",
  //         reason: data.reason ?? "",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch leave request:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /* ------------------------------------------------------------------------ */
  /*                         FETCH BRANCH / SHIFT / LEAVE                     */
  /* ------------------------------------------------------------------------ */

  const fetchBranchList = async () => {
    setBranchLoading(true);

    try {
      const [branchResponse, leaveResponse] = await Promise.all([
        getBranchShiftDepartment(),
        getLeaves({
          page: 1,
          limit: 200,
          status: statusEnum.ACTIVE,
        }),
      ]);

      // Handle leaves
      if (leaveResponse?.success) {
        setLeaveOptions(
          (leaveResponse.data.leaves || []).map((ele: ILeave) => ({
            label: ele.name,
            value: ele._id,
          })),
        );
      } else {
        setLeaveOptions([]);
      }

      // Handle branches
      if (branchResponse?.success) {
        const branches = branchResponse.data || [];

        setBranchOptions(
          branches.map((branch: IBranch) => ({
            label: branch.name,
            value: branch._id,
          })),
        );
      } else {
        setBranchOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch branch and leave data:", error);
      setBranchOptions([]);
      setLeaveOptions([]);
    } finally {
      setBranchLoading(false);
    }
  };

  // get Employee Details by Branch
  const getEmployeeDetailsByBranchId = async (value: string) => {
    setBranchLoading(true);
    try {
      const response = await getManagedEmployee(value);
      if (response.success) {
        setEmployeeOptions(
          response?.data?.map((ele: IUser) => ({
            value: ele?._id,
            label: `${ele?.firstName} ${ele?.lastName}`,
          })),
        );
      } else {
        setEmployeeOptions([]);
      }
    } catch (err) {
      console.log("ERROR", err);
    } finally {
      setBranchLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                            HANDLE CHANGE                                  */
  /* ------------------------------------------------------------------------ */

  const handleChange = <K extends keyof LeaveFormData>(
    field: K,
    value: LeaveFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    /**
     * Clear field error when user changes the value.
     */
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /* ------------------------------------------------------------------------ */
  /*                      HANDLE BRANCH / SHIFT                               */
  /* ------------------------------------------------------------------------ */

  const handleSelectFilter = (name: "branchId" | "shiftId", value: string) => {
    if (name === "branchId") {
      setBranchId(value);
      if (value) {
        getEmployeeDetailsByBranchId(value);
      }

      /**
       * Reset employee when branch changes.
       */
      setEmployeeOptions([]);

      handleChange("userId", "");
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              VALIDATION                                  */
  /* ------------------------------------------------------------------------ */

  const validate = () => {
    const newErrors: Partial<Record<keyof LeaveFormData, string>> = {};

    /* ------------------------------ Employee ------------------------------ */

    if (!formData.userId) {
      newErrors.userId = "Employee is required";
    }

    /* ------------------------------ Leave --------------------------------- */

    if (!formData.leaveId) {
      newErrors.leaveId = "Leave type is required";
    }

    /* ------------------------------ Start Date ---------------------------- */

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    /* ------------------------------ End Date ------------------------------ */

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    /* --------------------------- Date Validation -------------------------- */

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    /* ------------------------------ Duration ------------------------------ */

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /*                         SCROLL FIRST ERROR                               */
  /* ------------------------------------------------------------------------ */

  const scrollToFirstError = (
    validationErrors: Partial<Record<keyof LeaveFormData, string>>,
  ) => {
    const firstErrorKey = Object.keys(validationErrors)[0];

    if (!firstErrorKey || !formRef.current) {
      return;
    }

    const field = formRef.current.querySelector(`[name="${firstErrorKey}"]`);

    if (!field) {
      return;
    }

    field.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      if ("focus" in field) {
        (field as HTMLElement).focus();
      }
    }, 300);
  };

  /* ------------------------------------------------------------------------ */
  /*                              SUBMIT                                      */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /**
     * Validate before API call.
     */
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      /**
       * Form data already matches API payload.
       */
      const payload: LeaveFormData = {
        ...formData,
        startDate: formatDate(formData.startDate, DateFormat.ISO_DATE),
        endDate: formatDate(formData.endDate, DateFormat.ISO_DATE),
      };
      const response = await addLeaveRequest(payload);

      if (response?.success) {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to submit leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              CLOSE                                       */
  /* ------------------------------------------------------------------------ */

  const handleClose = () => {
    setFormData(initialFormData);
    navigate(pathNames.LEAVE_REQUEST);
  };

  /* ------------------------------------------------------------------------ */
  /*                   Open Action For Confirmation                           */
  /* ------------------------------------------------------------------------ */

  const handleAction = () => {
    if (!validate()) {
      return;
    }
    setActionOpen((prev) => !prev);
  };

  /* ------------------------------------------------------------------------ */
  /*                          CONFIRM SUBMIT                                  */
  /* ------------------------------------------------------------------------ */

  const handleOnConfirm = async () => {
    await formRef.current?.requestSubmit();
  };

  /* ------------------------------------------------------------------------ */
  /*                               RENDER                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <TopBar
        title={"Add Leave Request"}
        actionButtons={
          <div className="flex gap-3">
            <Button name="Action" size="sm" onClick={handleAction} />
            <Button
              size="sm"
              variant="danger"
              onClick={handleClose}
              leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger" />}
            />
          </div>
        }
      />

      <div className="content-area">
        <PageLoader loading={branchLoading || loading} />

        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:w-[25%] md:w-[35%] gap-3">
            {/* ---------------------------------------------------------------- */}
            {/*                              BRANCH                              */}
            {/* ---------------------------------------------------------------- */}

            <SelectField
              placeholder="Select Branch"
              label="Branch"
              required
              value={
                branchId
                  ? (branchOptions.find(
                      (option) => option.value === branchId,
                    ) ?? "")
                  : ""
              }
              name="branchId"
              options={branchOptions}
              onChange={(option) =>
                handleSelectFilter("branchId", option.value)
              }
            />

            {/* ---------------------------------------------------------------- */}
            {/*                             EMPLOYEE                             */}
            {/* ---------------------------------------------------------------- */}

            <SelectField
              placeholder="Select Employee"
              label="Employee"
              required
              value={
                formData.userId
                  ? (employeeOptions.find(
                      (option) => option.value === formData.userId,
                    ) ?? "")
                  : ""
              }
              name="userId"
              options={employeeOptions}
              error={errors.userId}
              onChange={(option) => handleChange("userId", option.value)}
            />

            {/* ---------------------------------------------------------------- */}
            {/*                           LEAVE TYPE                             */}
            {/* ---------------------------------------------------------------- */}

            <SelectField
              placeholder="Select Leave"
              label="Leave Type"
              required
              value={
                formData.leaveId
                  ? (leaveOptions.find(
                      (option) => option.value === formData.leaveId,
                    ) ?? "")
                  : ""
              }
              name="leaveId"
              options={leaveOptions}
              error={errors.leaveId}
              onChange={(option) => handleChange("leaveId", option.value)}
            />

            {/* ---------------------------------------------------------------- */}
            {/*                            DURATION                              */}
            {/* ---------------------------------------------------------------- */}

            <SelectField
              placeholder="Select Duration"
              label="Duration"
              required
              value={
                formData.duration
                  ? (durationOptions.find(
                      (option) => option.value === formData.duration,
                    ) ?? "")
                  : ""
              }
              name="duration"
              options={durationOptions}
              error={errors.duration}
              onChange={(option) =>
                handleChange("duration", option.value as LeaveDuration)
              }
            />

            {/* ---------------------------------------------------------------- */}
            {/*                              DATE                                */}
            {/* ---------------------------------------------------------------- */}

            <div
              className="flex flex-col"
              data-error={!!(errors.startDate || errors.endDate)}
            >
              <DateRangePicker
                label="Date"
                required
                startDate={
                  formData.startDate ? new Date(formData.startDate) : null
                }
                endDate={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(dates: [Date | null, Date | null]) => {
                  const [start, end] = dates;

                  handleChange("startDate", start ? start.toISOString() : "");

                  handleChange("endDate", end ? end.toISOString() : "");
                }}
                minDate={new Date()}
              />

              {(errors.startDate || errors.endDate) && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.startDate || errors.endDate}
                </span>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/*                             REASON                              */}
            {/* ---------------------------------------------------------------- */}

            <TextAreaField
              label="Reason"
              name="reason"
              value={formData.reason}
              error={errors.reason}
              placeholder="Enter reason"
              onChange={(e) => handleChange("reason", e.target.value)}
            />
          </div>
        </form>
      </div>
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to apply leave?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
};

export default AddLeaveRequest;
