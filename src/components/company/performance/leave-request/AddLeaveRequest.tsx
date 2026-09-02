import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import PageLoader from "../../../common/loader/PageLoader";
import SelectField from "../../../common/select/SelectField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import ActionModal from "../../../common/modal/ActionModal";
import Toggle from "../../../common/toggle";

import { pathNames } from "../../../../constants/constants";

import {
  addLeaveRequest,
  getLeaveBucket,
  LeaveFormData,
} from "../../../../apis/performance/leave-request.api";

import {
  IOption,
  LeaveDuration,
  RoleEnum,
} from "../../../../types/common-types";

import { getBranchShiftDepartment } from "../../../../apis/workforce/onboardings.api";

import { IBranch } from "../../workforce/onboarding/assign-roles-responsibility";

import { getManagedEmployee } from "../../../../apis/workforce/all-employee.api";

import { DateFormat, formatDate } from "../../../../utils/date-format";

import { IUser } from "../../../../types/user.types";

import { useAuthStore } from "../../../../store/auth-store";
import TextField from "../../../common/text-field/TextField";

/* -------------------------------------------------------------------------- */
/*                             INITIAL FORM DATA                              */
/* -------------------------------------------------------------------------- */

/**
 * Common form fields.
 *
 * Leave Type and Duration are NOT kept here because
 * they are different for every selected date.
 */
interface ICommonLeaveFormData {
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ILeaveBucket {
  _id: string;
  leaveId: {
    _id: string;
    name: string;
    isPaid: boolean;
  };
  allocated: number;
  pendingApproval: number;
  used: number;
}

const initialFormData: ICommonLeaveFormData = {
  userId: "",
  startDate: "",
  endDate: "",
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
/*                              TABLE ROW TYPE                                */
/* -------------------------------------------------------------------------- */

interface LeaveDateRow {
  id: string;
  date: Date;
  leaveId: string;
  duration: LeaveDuration | "";
}

/* -------------------------------------------------------------------------- */
/*                             ROW ERROR TYPE                                 */
/* -------------------------------------------------------------------------- */

interface LeaveRowErrors {
  leaveId?: string;
  duration?: string;
}

/* -------------------------------------------------------------------------- */
/*                           COMPONENT                                        */
/* -------------------------------------------------------------------------- */

const AddLeaveRequest: React.FC = () => {
  const { user } = useAuthStore();

  const isEmployee = user.role === RoleEnum.EMPLOYEE;
  const isManager = user.role === RoleEnum.MANAGER;

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  /* ------------------------------------------------------------------------ */
  /*                                STATES                                    */
  /* ------------------------------------------------------------------------ */

  const [loading, setLoading] = useState(false);

  const [branchLoading, setBranchLoading] = useState(false);

  const [self, setSelf] = useState<boolean>(true);

  const [actionOpen, setActionOpen] = useState<boolean>(false);

  /**
   * Branch is only used for employee filtering.
   * It is NOT sent to API.
   */
  const [branchId, setBranchId] = useState("");

  const [branchOptions, setBranchOptions] = useState<IOption[]>([]);

  const [employeeOptions, setEmployeeOptions] = useState<IOption[]>([]);

  const [leaveOptions, setLeaveOptions] = useState<IOption[]>([]);

  /**
   * Common form data.
   *
   * Contains:
   * - userId
   * - startDate
   * - endDate
   * - reason
   */
  const [formData, setFormData] =
    useState<ICommonLeaveFormData>(initialFormData);

  /**
   * Every selected date gets one row.
   *
   * Example:
   *
   * 12 June -> Casual Leave -> Full Day
   * 13 June -> Sick Leave   -> First Half
   * 14 June -> Casual Leave -> Second Half
   */
  const [leaveRows, setLeaveRows] = useState<LeaveDateRow[]>([]);

  /**
   * Normal form errors.
   */
  const [errors, setErrors] = useState<
    Partial<Record<keyof ICommonLeaveFormData, string>>
  >({});

  /**
   * Row-wise errors.
   *
   * {
   *   "2026-06-12": {
   *      leaveId: "Leave type is required"
   *   }
   * }
   */
  const [rowErrors, setRowErrors] = useState<Record<string, LeaveRowErrors>>(
    {},
  );

  /* ------------------------------------------------------------------------ */
  /*                            INITIAL LOAD                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchInitialData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         FETCH INITIAL DATA                               */
  /* ------------------------------------------------------------------------ */

  const fetchInitialData = async () => {
    setBranchLoading(true);

    try {
      const [branchResponse, leaveBucketResponse] = await Promise.all([
        getBranchShiftDepartment(),

        getLeaveBucket(new Date().getFullYear(), formData.userId || user._id),
      ]);

      /* ----------------------------- LEAVES ------------------------------ */

      if (leaveBucketResponse?.success) {
        setLeaveOptions(
          (leaveBucketResponse.data || []).map((ele: ILeaveBucket) => ({
            label: `${ele.leaveId.name} ${ele.used}/${ele.allocated}`,
            value: ele.leaveId._id,
          })),
        );
      } else {
        setLeaveOptions([]);
      }

      /* ----------------------------- BRANCH ------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /*                     GET EMPLOYEE BY BRANCH                               */
  /* ------------------------------------------------------------------------ */

  const getEmployeeDetailsByBranchId = async (value: string) => {
    setBranchLoading(true);

    try {
      const response = await getManagedEmployee(value);

      if (response?.success) {
        setEmployeeOptions(
          (response?.data || []).map((ele: IUser) => ({
            value: ele?._id,
            label: `${ele?.firstName} ${ele?.lastName}`,
          })),
        );
      } else {
        setEmployeeOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      setEmployeeOptions([]);
    } finally {
      setBranchLoading(false);
    }
  };

  const getLeaveBucketByUserId = async (userId: string) => {
    const response = await getLeaveBucket(new Date().getFullYear(), userId);
    if (response?.success) {
      setLeaveOptions(
        (response.data || []).map((ele: ILeaveBucket) => ({
          label: `${ele.leaveId.name} ${ele.used}/${ele.allocated}`,
          value: ele.leaveId._id,
        })),
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                         COMMON FIELD CHANGE                              */
  /* ------------------------------------------------------------------------ */

  const handleChange = <K extends keyof ICommonLeaveFormData>(
    field: K,
    value: ICommonLeaveFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "endDate" && value) {
      generateDateRows(new Date(formData.startDate), new Date(value));
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /* ------------------------------------------------------------------------ */
  /*                       BRANCH / EMPLOYEE CHANGE                           */
  /* ------------------------------------------------------------------------ */

  const handleSelectFilter = (name: "branchId" | "userId", value: string) => {
    if (name === "branchId") {
      setBranchId(value);

      /**
       * Reset employee whenever branch changes.
       */
      setEmployeeOptions([]);

      handleChange("userId", "");

      if (value) {
        getEmployeeDetailsByBranchId(value);
      }
    }
    if (name === "userId") {
      handleChange("userId", value);

      /**
       * Reset leave option based on branch.
       */
      setLeaveOptions([]);

      if (value) {
        getLeaveBucketByUserId(value);
      }
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                       DATE KEY HELPER                                    */
  /* ------------------------------------------------------------------------ */

  /**
   * Creates a stable local-date key.
   *
   * Example:
   * 2026-06-12
   */
  const getDateKey = (date: Date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ------------------------------------------------------------------------ */
  /*                     GENERATE DATE ROWS                                   */
  /* ------------------------------------------------------------------------ */

  const generateDateRows = (startDate: Date | null, endDate: Date | null) => {
    /**
     * If either date is missing,
     * remove table rows.
     */
    if (!startDate || !endDate) {
      setLeaveRows([]);
      setRowErrors({});
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    /**
     * Normalize time.
     */
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    /**
     * Invalid range.
     */
    if (end < start) {
      setLeaveRows([]);
      setRowErrors({});
      return;
    }

    /**
     * Preserve existing row selections.
     *
     * If user changes:
     *
     * 12 -> 14
     *
     * to:
     *
     * 12 -> 15
     *
     * selections for 12, 13, 14 remain.
     */
    const existingRowsMap = new Map(
      leaveRows.map((row) => [getDateKey(row.date), row]),
    );

    const rows: LeaveDateRow[] = [];

    const current = new Date(start);

    while (current <= end) {
      const date = new Date(current);

      const dateKey = getDateKey(date);

      const existingRow = existingRowsMap.get(dateKey);

      rows.push({
        id: dateKey,

        date,

        leaveId: existingRow?.leaveId || "",

        duration: existingRow?.duration || "",
      });

      current.setDate(current.getDate() + 1);
    }

    setLeaveRows(rows);

    /**
     * Clear row errors whenever date range changes.
     */
    setRowErrors({});
  };

  /* ------------------------------------------------------------------------ */
  /*                         UPDATE TABLE ROW                                 */
  /* ------------------------------------------------------------------------ */

  const updateLeaveRow = (
    rowId: string,
    field: "leaveId" | "duration",
    value: string,
  ) => {
    setLeaveRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );

    /**
     * Clear only the changed field error.
     */
    setRowErrors((prev) => {
      const currentError = prev[rowId];

      if (!currentError) {
        return prev;
      }

      const updatedError = {
        ...currentError,
        [field]: "",
      };

      /**
       * If no errors remain for this row,
       * remove the row from errors.
       */
      if (!updatedError.leaveId && !updatedError.duration) {
        const newErrors = {
          ...prev,
        };

        delete newErrors[rowId];

        return newErrors;
      }

      return {
        ...prev,
        [rowId]: updatedError,
      };
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                         VALIDATION                                      */
  /* ------------------------------------------------------------------------ */

  const validate = () => {
    const newErrors: Partial<Record<keyof ICommonLeaveFormData, string>> = {};

    const newRowErrors: Record<string, LeaveRowErrors> = {};

    /* ---------------------------- EMPLOYEE ------------------------------- */

    if (!isEmployee && self) {
      if (!formData.userId) {
        newErrors.userId = "Employee is required";
      }
    }

    /* ---------------------------- START DATE ----------------------------- */

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    /* ----------------------------- END DATE ------------------------------ */

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    /* -------------------------- DATE VALIDATION -------------------------- */

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);

      const end = new Date(formData.endDate);

      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    /* --------------------------- TABLE ROWS ------------------------------ */

    if (leaveRows.length === 0) {
      newErrors.startDate = "Please select a valid date range";
    }

    /**
     * Validate every row separately.
     */
    leaveRows.forEach((row) => {
      const errors: LeaveRowErrors = {};

      if (!row.leaveId) {
        errors.leaveId = "Leave type is required";
      }

      if (!row.duration) {
        errors.duration = "Applied for is required";
      }

      if (Object.keys(errors).length > 0) {
        newRowErrors[row.id] = errors;
      }
    });

    setErrors(newErrors);

    setRowErrors(newRowErrors);

    const hasFormErrors = Object.keys(newErrors).length > 0;

    const hasRowErrors = Object.keys(newRowErrors).length > 0;

    if (hasFormErrors || hasRowErrors) {
      scrollToFirstValidationError(newErrors, newRowErrors);

      return false;
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /*                   SCROLL FIRST FORM ERROR                               */
  /* ------------------------------------------------------------------------ */

  const scrollToFirstError = (
    validationErrors: Partial<Record<keyof ICommonLeaveFormData, string>>,
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
      if (
        "focus" in field &&
        typeof (
          field as HTMLElement & {
            focus?: () => void;
          }
        ).focus === "function"
      ) {
        (field as HTMLElement).focus();
      }
    }, 300);
  };

  /* ------------------------------------------------------------------------ */
  /*                 SCROLL FIRST VALIDATION ERROR                            */
  /* ------------------------------------------------------------------------ */

  const scrollToFirstValidationError = (
    formErrors: Partial<Record<keyof ICommonLeaveFormData, string>>,
    tableErrors: Record<string, LeaveRowErrors>,
  ) => {
    /**
     * Form error has priority.
     */
    if (Object.keys(formErrors).length > 0) {
      scrollToFirstError(formErrors);
      return;
    }

    /**
     * Otherwise scroll to first table error.
     */
    const firstRowId = Object.keys(tableErrors)[0];

    if (!firstRowId || !formRef.current) {
      return;
    }

    const row = formRef.current.querySelector(`[data-row-id="${firstRowId}"]`);

    if (!row) {
      return;
    }

    row.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                          CREATE PAYLOADS                                */
  /* ------------------------------------------------------------------------ */

  /**
   * Converts table rows into your existing API payload.
   *
   * Every row becomes:
   *
   * {
   *   userId,
   *   leaveId,
   *   startDate,
   *   endDate,
   *   duration,
   *   reason
   * }
   */
  const createPayloads = (): LeaveFormData => {
    const leaves = leaveRows.map((row) => ({
      leaveId: row.leaveId,
      date: formatDate(row.date, DateFormat.ISO_DATE),

      duration: row.duration as LeaveDuration,
    }));
    return {
      userId: !self ? user._id : formData.userId,
      reason: formData.reason,
      leaves: leaves,
    };
  };

  /* ------------------------------------------------------------------------ */
  /*                              SUBMIT                                     */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /**
     * Validate everything before API call.
     */
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      /**
       * Convert all table rows into API payloads.
       */
      const payloads = createPayloads();

      /**
       * Your existing API appears to accept
       * one LeaveFormData object.
       *
       * Therefore send one request per day.
       */
      const response = await addLeaveRequest(payloads);

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
  /*                          CLOSE                                          */
  /* ------------------------------------------------------------------------ */

  const handleClose = () => {
    setFormData(initialFormData);

    setLeaveRows([]);

    setRowErrors({});

    setErrors({});

    setBranchId("");

    setEmployeeOptions([]);

    navigate(pathNames.LEAVE_REQUEST);
  };

  /* ------------------------------------------------------------------------ */
  /*                      ACTION BUTTON                                      */
  /* ------------------------------------------------------------------------ */

  const handleAction = () => {
    if (!validate()) {
      return;
    }

    setActionOpen((prev) => !prev);
  };

  /* ------------------------------------------------------------------------ */
  /*                       CONFIRM SUBMIT                                     */
  /* ------------------------------------------------------------------------ */

  const handleOnConfirm = async () => {
    await formRef.current?.requestSubmit();
  };

  /* ------------------------------------------------------------------------ */
  /*                          SELF TOGGLE                                     */
  /* ------------------------------------------------------------------------ */

  const handleSelfToggle = () => {
    setSelf((prev) => {
      if(prev){
        getLeaveBucketByUserId(user._id);
      } else {
        formData.userId && getLeaveBucketByUserId(formData.userId);
      }
      return !prev
    });
    
  };

  /* ------------------------------------------------------------------------ */
  /*                              RENDER                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      {/* ================================================================== */}
      {/*                               TOP BAR                              */}
      {/* ================================================================== */}

      <TopBar
        title="Add Leave Request"
        actionButtons={
          <div className="flex items-center gap-3">
            {isManager && (
              <Toggle
                label="For Employee"
                checked={self}
                onChange={handleSelfToggle}
              />
            )}

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

      {/* ================================================================== */}
      {/*                             CONTENT                                */}
      {/* ================================================================== */}

      <div className="content-area">
        <PageLoader loading={branchLoading || loading} />

        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          {/* ============================================================ */}
          {/*                         COMMON FIELDS                        */}
          {/* ============================================================ */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:w-[25%]
              md:w-[35%]
              lg:w-[35%]
            "
          >
            {/* ---------------------------------------------------------- */}
            {/*                            BRANCH                          */}
            {/* ---------------------------------------------------------- */}

            {!isEmployee && self && (
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
            )}

            {/* ---------------------------------------------------------- */}
            {/*                           EMPLOYEE                         */}
            {/* ---------------------------------------------------------- */}

            {!isEmployee && self && (
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
                onChange={(option) =>
                  handleSelectFilter("userId", option.value)
                }
              />
            )}

            {/* ---------------------------------------------------------- */}
            {/*                             DATE                           */}
            {/* ---------------------------------------------------------- */}
            <TextField
              label={"Start Date"}
              required
              type="date"
              value={formData.startDate}
              error={errors.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              min={formatDate(new Date(), DateFormat.ISO_DATE)}
            />
            <TextField
              label={"End Date"}
              required
              type="date"
              value={formData.endDate}
              error={errors.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              disabled={!formData.startDate}
              min={formatDate(formData.startDate, DateFormat.ISO_DATE)}
            />

            {/* ============================================================ */}
            {/*                            REASON                            */}
            {/* ============================================================ */}

            <TextAreaField
              label="Reason"
              name="reason"
              value={formData.reason}
              error={errors.reason}
              placeholder="Enter reason"
              onChange={(e) => handleChange("reason", e.target.value)}
            />
          </div>

          {/* ============================================================ */}
          {/*                         LEAVE TABLE                          */}
          {/* ============================================================ */}

          {leaveRows.length > 0 && (
            <div className="mt-5 w-full overflow-hidden rounded-sm border-t border-borderPrimary">
              {/* -------------------------------------------------------- */}
              {/*                    MOBILE SCROLL CONTAINER               */}
              {/* -------------------------------------------------------- */}

              <div className="w-full overflow-x-auto">
                <div
                  className="
                    min-w-[800px]
                  "
                >
                  {/* ================================================== */}
                  {/*                         HEADER                       */}
                  {/* ================================================== */}

                  <div
                    className="
                      grid
                      grid-cols-[50px_100px_minmax(150px,1fr)_minmax(150px,1fr)]
                      bg-[#f1f1f1]
                    "
                  >
                    <div className="px-3 py-3 text-sm font-medium text-secondary">
                      Day
                    </div>

                    <div className="px-3 py-3 text-sm font-medium text-secondary">
                      Date
                    </div>

                    <div className="px-3 py-3 text-sm font-medium text-secondary">
                      Leave Type
                    </div>

                    <div className="px-3 py-3 text-sm font-medium text-secondary">
                      Applied For
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/*                           ROWS                       */}
                  {/* ================================================== */}

                  {leaveRows.map((row, index) => {
                    const currentErrors = rowErrors[row.id];

                    return (
                      <div
                        key={row.id}
                        data-row-id={row.id}
                        className="
                            grid
                            grid-cols-[50px_100px_minmax(150px,1fr)_minmax(150px,1fr)]
                            border-t
                            border-borderPrimary
                            bg-white
                          "
                      >
                        {/* ------------------------------------------------ */}
                        {/*                            DAY                  */}
                        {/* ------------------------------------------------ */}

                        <div
                          className="
                              flex
                              items-center
                              px-3
                              py-3
                              text-sm
                              text-secondary
                            "
                        >
                          {index + 1}
                        </div>

                        {/* ------------------------------------------------ */}
                        {/*                           DATE                  */}
                        {/* ------------------------------------------------ */}

                        <div
                          className="
                              flex
                              items-center
                              px-3
                              py-3
                              text-sm
                              text-secondary
                            "
                        >
                          {formatDate(row.date)}
                        </div>

                        {/* ------------------------------------------------ */}
                        {/*                       LEAVE TYPE                */}
                        {/* ------------------------------------------------ */}

                        <div className="px-3 py-2">
                          <SelectField
                            placeholder="Select Leave"
                            value={
                              row.leaveId
                                ? (leaveOptions.find(
                                    (option) => option.value === row.leaveId,
                                  ) ?? "")
                                : ""
                            }
                            options={leaveOptions}
                            error={currentErrors?.leaveId}
                            name={`leaveId-${row.id}`}
                            onChange={(option) =>
                              updateLeaveRow(row.id, "leaveId", option.value)
                            }
                          />
                        </div>

                        {/* ------------------------------------------------ */}
                        {/*                       APPLIED FOR              */}
                        {/* ------------------------------------------------ */}

                        <div className="px-3 py-2">
                          <SelectField
                            placeholder="Select an option"
                            value={
                              row.duration
                                ? (durationOptions.find(
                                    (option) => option.value === row.duration,
                                  ) ?? "")
                                : ""
                            }
                            options={durationOptions}
                            error={currentErrors?.duration}
                            name={`duration-${row.id}`}
                            onChange={(option) =>
                              updateLeaveRow(row.id, "duration", option.value)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ================================================================== */}
      {/*                         CONFIRMATION MODAL                        */}
      {/* ================================================================== */}

      <ActionModal
        isOpen={actionOpen}
        title="Are you sure you want to apply leave?"
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
};

export default AddLeaveRequest;
