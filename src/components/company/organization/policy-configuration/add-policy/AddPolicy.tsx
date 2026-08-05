import { useEffect, useRef, useState } from "react";
import TextField from "../../../../common/text-field/TextField";
import {
  addPolicy,
  getPolicyById,
  updatePolicy,
} from "../../../../../apis/organization/policy.api";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import PageLoader from "../../../../common/loader/PageLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { pathNames } from "../../../../../constants/constants";
import {
  leaveEncashmentType,
  statusEnum,
} from "../../../../../types/common-types";
import AttendanceSettings from "./AttendanceSettings";
import LeaveSetting from "./LeaveSettings";
import { getLeaves } from "../../../../../apis/organization/leave.api";
import { ILeave } from "../../leave";
import ActionModal from "../../../../common/modal/ActionModal";

export interface ILeaveData {
  name: string;
  leaveId: string;
  limit: number;
  hoursBeforeLeave: number;
}

export interface PolicyFormData {
  name: string;

  workHours: {
    workingHours: number | string;
    startTime: string;
    endTime: string;
    weeklyOffs: string[];
    minimumHoursForHalfDay: number | string;
    minimumHoursForFullDay: number | string;
  };

  lateRule: {
    allowedLateMinutes: number;
    allowedEarlyMinutes: number;

    allowedLateCount: number;
    onAbsentSlarayDaysCut: number;

    fullDayMinHours: number;

    halfDayWorkMinHours: number;
    halfDayWorkMaxHours: number;
  };

  overtime: {
    enabled: boolean;
    minimumMinutes: number;
    overtimeRate: number;
  };

  sandwichRule: {
    enabled: boolean;
    beforeAfterWeekOff: boolean;
    beforeAfterHoliday: boolean;
  };

  leaveEncashment: {
    enabled: boolean;
    maxLeaves: number;
    period: leaveEncashmentType;
  };

  carryForwardLeave: {
    enabled: boolean;
    maxLeaves: number;
  };

  continuousLeave: {
    enabled: boolean;
    maxLeaves: number;
    allowedInProbation: boolean;
  };

  leaves: ILeaveData[];

  manualPunch: {
    enabled: boolean;
    limit: number;
  };
}

const AddPolicy: React.FC<{
  editPolicyId?: string;
  handleClosePolicy?: () => void;
}> = ({ editPolicyId, handleClosePolicy = () => {} }) => {
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const policyId = editPolicyId ?? location?.state?.id;

  const [actionOpen, setActionOpen] = useState<boolean>(false);

  const initialFormData: PolicyFormData = {
    name: "",

    workHours: {
      workingHours: 8,
      startTime: "",
      endTime: "",
      weeklyOffs: [],
      minimumHoursForHalfDay: 0,
      minimumHoursForFullDay: 0,
    },

    lateRule: {
      allowedLateMinutes: 0,
      allowedEarlyMinutes: 0,
      allowedLateCount: 0,
      onAbsentSlarayDaysCut: 0,
      fullDayMinHours: 0,
      halfDayWorkMinHours: 0,
      halfDayWorkMaxHours: 0,
    },

    overtime: {
      enabled: false,
      minimumMinutes: 0,
      overtimeRate: 0,
    },

    sandwichRule: {
      enabled: false,
      beforeAfterWeekOff: false,
      beforeAfterHoliday: false,
    },

    leaveEncashment: {
      enabled: false,
      maxLeaves: 0,
      period: leaveEncashmentType.YEARLY,
    },

    carryForwardLeave: {
      enabled: false,
      maxLeaves: 0,
    },

    continuousLeave: {
      enabled: false,
      maxLeaves: 0,
      allowedInProbation: false,
    },

    leaves: [],

    manualPunch: {
      enabled: false,
      limit: 0,
    },
  };

  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PolicyFormData, string>>
  >({});

  useEffect(() => {
    (async () => {
      await fetchLeaves();
      if (policyId) {
        await fetchPolicy();
      }
      setLoading(false);
    })();
  }, [policyId]);

  const fetchPolicy = async () => {
    // setLoading(true);
    const response = await getPolicyById(policyId);
    if (response?.success) {
      setFormData((prev) => {
        return {
          ...response?.data,
          leaves: prev.leaves?.map((leave: ILeaveData) => {
            const leaveData = response?.data.leaves.find(
              (el: any) => el.leaveId === leave.leaveId,
            );
            return {
              name: leave.name,
              leaveId: leave?.leaveId,
              limit: leaveData?.limit,
              hoursBeforeLeave: leaveData?.hoursBeforeLeave,
            };
          }),
        };
      });
    }
    // setLoading(false);
  };

  const fetchLeaves = async () => {
    const response = await getLeaves({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response?.success && response?.data?.leaves?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        leaves: response?.data?.leaves?.map((leave: ILeave) => ({
          name: leave.name,
          leaveId: leave?._id,
          limit: 0,
          hoursBeforeLeave: 0,
        })),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        leaves: [],
      }));
    }
  };

  const handleChange = (
    field: string,
    value: any | string[],
    section?: keyof PolicyFormData,
  ) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as object),
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [section ? `${String(section)}.${field}` : field]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Policy name is required";
    }

    if (formData.workHours.weeklyOffs.length === 0) {
      newErrors["workHours.weeklyOffs"] = "Select at least one weekly off";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleLeaveChange = (
    index: number,
    field: keyof PolicyFormData["leaves"][0],
    value: any,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.leaves];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        leaves: updated,
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      scrollToFirstError(newErrors);
      return;
    }

    setLoading(true);

    const response = policyId
      ? await updatePolicy(formData, policyId)
      : await addPolicy(formData);

    if (response.success) {
      handleClose();
    }

    setLoading(false);
  };

  const scrollToFirstError = (
    errors: Partial<Record<keyof PolicyFormData, string>>,
  ) => {
    const firstErrorKey = Object.keys(errors)[0];

    if (!firstErrorKey || !formRef.current) return;

    const field = formRef.current.querySelector(`[name="${firstErrorKey}"]`);

    if (field) {
      field.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        if ("focus" in field) {
          (field as HTMLElement).focus();
        }
      }, 300);
    }
  };

  const handleClose = () => {
    resetForm();
    if (editPolicyId) {
      handleClosePolicy();
    } else navigate(pathNames.POLICY_CONFIGURATION);
  };

  const handleAction = () => {
    if (!validate()) return;
    setActionOpen((prev) => !prev);
  };

  const handleOnConfirm = async () => {
    await formRef.current?.requestSubmit();
  };

  return (
    <>
      {!editPolicyId && (
        <TopBar
          title="Add Policy"
          actionButtons={
            <div className="flex gap-2">
              <Button name="Action" size="sm" onClick={handleAction} />
              <Button
                size="sm"
                variant={"danger"}
                onClick={handleClose}
                leftIcon={
                  <i className="fa-solid fa-xmark fa-xl text-danger"></i>
                }
              />
            </div>
          }
        />
      )}
      <div className={!editPolicyId ? "content-area" : ""}>
        <PageLoader loading={loading} />
        <form
          className="flex flex-col gap-2 pb-6"
          ref={formRef}
          method="POST"
          onSubmit={handleSubmit}
        >
          {!editPolicyId && (
            <div className={`grid grid-cols-1 w-[75%] gap-4`}>
              <TextField
                label="Policy Name"
                required
                name="name"
                value={formData.name}
                error={errors.name}
                placeholder="Enter policy name"
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          )}
          <AttendanceSettings
            data={formData}
            errors={errors}
            handleChange={handleChange}
            editPolicyId={editPolicyId}
          />
          <LeaveSetting
            data={formData}
            handleLeaveChange={handleLeaveChange}
            handleChange={handleChange}
            leaveOptions={[]}
            editPolicyId={editPolicyId}
          />
        </form>
      </div>
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to ${policyId ? "edit" : "add"} this policy?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleOnConfirm}
      />
    </>
  );
};

export default AddPolicy;
