import { useEffect, useRef, useState } from "react";
import PageLoader from "../../../common/loader/PageLoader";
import SelectField from "../../../common/select/SelectField";
import { IOption, RoleEnum } from "../../../../types/common-types";
import { getBranchShiftDepartment } from "../../../../apis/workforce/onboardings.api";
import { IBranch } from "../../workforce/onboarding/assign-roles-responsibility";
import { getManagedEmployee } from "../../../../apis/workforce/all-employee.api";
import { IUser } from "../../../../types/user.types";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import RadioButton from "../../../common/radio-button";
import {
  IManualPunch,
  IManualPunchErrors,
  IManualPunchRequest,
  PunchType,
} from "../../../../types/company/performance/manual-punch-request.types";
import { useAuthStore } from "../../../../store/auth-store";
import Toggle from "../../../common/toggle";
import { addManualPunchRequest } from "../../../../apis/performance/manual-punch-request.api";

interface AddManualPunchRequestProps {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

/* -------------------------------------------------------------------------- */
/*                             INITIAL FORM DATA                              */
/* -------------------------------------------------------------------------- */

const initialFormData: IManualPunchRequest = {
  userId: "",
  punchType: "both",
  manual: {
    inTime: "",
    outTime: "",
    date: "",
  },
};

/* -------------------------------------------------------------------------- */
/*                            PUNCH TYPE OPTIONS                              */
/* -------------------------------------------------------------------------- */

const punchTypeOption: IOption[] = [
  {
    label: "Punch In",
    value: "in",
  },
  {
    label: "Punch Out",
    value: "out",
  },
  {
    label: "Both",
    value: "both",
  },
];

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

const AddManualPunchRequest: React.FC<AddManualPunchRequestProps> = ({
  isOpen,
  onClose,
  refreshData
}) => {
  const { user } = useAuthStore();
  const isManager = user.role === RoleEnum.MANAGER;
  const isEmployee = user.role === RoleEnum.EMPLOYEE;

  const formRef = useRef<HTMLFormElement>(null);

  /* ------------------------------------------------------------------------ */
  /*                                STATES                                    */
  /* ------------------------------------------------------------------------ */

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  /**
   * Branch / Shift are only used for filtering employees.
   * They are NOT part of the API payload.
   */
  const [branchId, setBranchId] = useState("");

  const [self, setSelf] = useState<boolean>(true);

  const [branchOptions, setBranchOptions] = useState<IOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<IOption[]>([]);

  /**
   * Main form state.
   *
   * This directly represents the API payload.
   */
  const [formData, setFormData] =
    useState<IManualPunchRequest>(initialFormData);

  const [errors, setErrors] = useState<IManualPunchErrors>({});

  /* ------------------------------------------------------------------------ */
  /*                              INITIAL LOAD                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchBranchList();
    getEmployeeDetailsByBranchId();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         FETCH BRANCH / SHIFT / LEAVE                     */
  /* ------------------------------------------------------------------------ */

  const fetchBranchList = async () => {
    setBranchLoading(true);

    try {
      const [branchResponse] = await Promise.all([
        getBranchShiftDepartment()
      ]);

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
    } finally {
      setBranchLoading(false);
    }
  };

  // get Employee Details by Branch
  const getEmployeeDetailsByBranchId = async (value: string = "") => {
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

  const handleChange = (field: keyof IManualPunchRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleManualChange = (field: keyof IManualPunch, value: string) => {
    setFormData((prev) => ({
      ...prev,
      manual: {
        ...prev.manual,
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      manual: {
        ...prev.manual,
        [field]: "",
      },
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
      } else {
        getEmployeeDetailsByBranchId();
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

  const validate = (): boolean => {
    const newErrors: IManualPunchErrors = {};

    // ---------------------------------------------
    // Employee
    // ---------------------------------------------
    if(!isEmployee && self){
      if (!formData.userId) {
        newErrors.userId = "Employee is required";
      }
    }

    // ---------------------------------------------
    // Punch Type
    // ---------------------------------------------
    if (!formData.punchType) {
      newErrors.punchType = "Punch type is required";
    }

    // ---------------------------------------------
    // Date
    // ---------------------------------------------
    if (!formData.manual.date) {
      newErrors.manual = {
        ...newErrors.manual,
        date: "Date is required",
      };
    }

    // ---------------------------------------------
    // Punch In
    // ---------------------------------------------
    if (
      (formData.punchType === "in" || formData.punchType === "both") &&
      !formData.manual.inTime
    ) {
      newErrors.manual = {
        ...newErrors.manual,
        inTime: "Punch in time is required",
      };
    }

    // ---------------------------------------------
    // Punch Out
    // ---------------------------------------------
    if (
      (formData.punchType === "out" || formData.punchType === "both") &&
      !formData.manual.outTime
    ) {
      newErrors.manual = {
        ...newErrors.manual,
        outTime: "Punch out time is required",
      };
    }

    // ---------------------------------------------
    // In Time / Out Time validation
    // ---------------------------------------------
    if (
      formData.manual.inTime &&
      formData.manual.outTime &&
      formData.manual.inTime >= formData.manual.outTime
    ) {
      newErrors.manual = {
        ...newErrors.manual,
        outTime: "Punch out time must be after punch in time",
      };
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ------------------------------------------------------------------------ */
  /*                              SUBMIT                                      */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload: Omit<IManualPunchRequest, "punchType"> = {
        userId: formData.userId ? formData.userId : user._id,
        manual: {
          date: formData.manual.date,
          inTime: formData.punchType === "out" ? "" : formData.manual.inTime,
          outTime: formData.punchType === "in" ? "" : formData.manual.outTime,
        },
      };

      console.log("Manual Punch Payload:", payload);

      // API call
      const response = await addManualPunchRequest(payload);

      if (response?.success) {
        onClose();
        refreshData();
      }
    } catch (error) {
      console.error("Failed to submit manual punch request:", error);
    } finally {
      setLoading(false);
    }
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
    <Modal
      isOpen={isOpen}
      title={"Add Manual Punch Request"}
      width="max-w-lg"
      onClose={onClose}
      handleOnConfirm={handleOnConfirm}
    >
      <div className="">
        <PageLoader loading={branchLoading || loading} />

        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3">
            {isManager && <Toggle
              label="For Employee"
              checked={self}
              onChange={() => setSelf((prev) => !prev)}
            />}
            {/* ---------------------------------------------------------------- */}
            {/*                              BRANCH                              */}
            {/* ---------------------------------------------------------------- */}

            {(!isEmployee && self) && (
              <SelectField
                placeholder="Select Branch"
                label="Branch"
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
                isMenuPortalTarget={false}
              />
            )}

            {/* ---------------------------------------------------------------- */}
            {/*                             EMPLOYEE                             */}
            {/* ---------------------------------------------------------------- */}

            {(!isEmployee && self) && (
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
                isMenuPortalTarget={false}
              />
            )}

            {/* ---------------------------------------------------------------- */}
            {/*                              DATE                                */}
            {/* ---------------------------------------------------------------- */}

            <TextField
              type="date"
              label="Date"
              required
              name="date"
              value={formData.manual.date}
              max={new Date().toISOString().split("T")[0]}
              error={errors.manual?.date}
              onChange={(e) => handleManualChange("date", e.target.value)}
            />

            {/* ---------------------------------------------------------------- */}
            {/*                           PUNCH TYPE                             */}
            {/* ---------------------------------------------------------------- */}
            <RadioButton
              label="Punch Type"
              required
              name="punchType"
              value={formData.punchType}
              options={punchTypeOption}
              onChange={(value: string) =>
                handleChange("punchType", value as PunchType)
              }
            />

            {/* ---------------------------------------------------------------- */}
            {/*                           PUNCH IN TIME                          */}
            {/* ---------------------------------------------------------------- */}
            {(formData.punchType === "in" || formData.punchType === "both") && (
              <TextField
                type="time"
                label="Punch In Time"
                required
                name="inTime"
                value={formData.manual.inTime}
                error={errors.manual?.inTime}
                onChange={(e) => handleManualChange("inTime", e.target.value)}
              />
            )}

            {/* ---------------------------------------------------------------- */}
            {/*                           PUNCH OUT TIME                         */}
            {/* ---------------------------------------------------------------- */}
            {(formData.punchType === "out" ||
              formData.punchType === "both") && (
              <TextField
                type="time"
                label="Punch Out Time"
                required
                name="outTime"
                value={formData.manual.outTime}
                error={errors.manual?.outTime}
                onChange={(e) => handleManualChange("outTime", e.target.value)}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddManualPunchRequest;
