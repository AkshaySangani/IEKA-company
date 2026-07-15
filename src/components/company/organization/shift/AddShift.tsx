import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import TextField from "../../../common/text-field/TextField";

import { branchEnum, pathNames } from "../../../../constants/constants";
import { getBranches } from "../../../../apis/organization/branch.api";
import {
  addShift,
  getShiftById,
  updateShift,
} from "../../../../apis/organization/shift.api";
import { IBranch } from "../branch";
import PageLoader from "../../../common/loader/PageLoader";
import Checkbox from "../../../common/checkbox/CheckBox";
import { IShift } from ".";
import { statusEnum } from "../../../../types/common-types";

interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  branchIds: string[];
}

const AddShift: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { shiftId } = location.state || {};

  const initialFormData: ShiftFormData = {
    name: "",
    startTime: "",
    endTime: "",
    breakStartTime: "",
    breakEndTime: "",
    branchIds: [],
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  const [branchList, setBranchList] = useState<IBranch[]>([]);

  const [formData, setFormData] = useState<ShiftFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShiftFormData, string>>
  >({});

  useEffect(() => {
    fetchBranchList();
  }, []);

  useEffect(() => {
    if (shiftId) {
      fetchShiftById(shiftId);
    }
  }, [shiftId]);

  // get shift by id
  const fetchShiftById = async (shiftId: string) => {
    setLoading(true);
    const response = await getShiftById(shiftId);
    if (response.success) {
      const shiftDetails: IShift = response.data;
      setFormData({
        name: shiftDetails.name,
        startTime: shiftDetails.startTime,
        endTime: shiftDetails.endTime,
        breakStartTime: shiftDetails.breakStartTime,
        breakEndTime: shiftDetails.breakEndTime,
        branchIds: shiftDetails.branchIds.map((ele) => ele._id),
      });
    }
    setLoading(false);
  };

  const fetchBranchList = async () => {
    setBranchLoading(true);

    const response = await getBranches({
      page: 1,
      limit: 0,
      status: statusEnum.ACTIVE,
      search: "",
    });

    if (response?.success) {
      setBranchList(response.data.branches || []);
    } else {
      setBranchList([]);
    }
    setBranchLoading(false);
  };

  const handleChange = (field: keyof ShiftFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleBranchToggle = (branchId: string) => {
    setFormData((prev) => {
      const isSelected = prev.branchIds.includes(branchId);

      return {
        ...prev,
        branchIds: isSelected
          ? prev.branchIds.filter((id) => id !== branchId)
          : [...prev.branchIds, branchId],
      };
    });

    setErrors((prev) => ({
      ...prev,
      branchIds: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof ShiftFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Shift name is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Shift start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Shift end time is required";
    }

    if (!formData.breakStartTime) {
      newErrors.breakStartTime = "Break start time is required";
    }

    if (!formData.breakEndTime) {
      newErrors.breakEndTime = "Break end time is required";
    }

    if (!formData.branchIds.length) {
      newErrors.branchIds = "Please select at least one branch";
    }

    // if (
    //   formData.startTime &&
    //   formData.endTime &&
    //   formData.startTime >= formData.endTime
    // ) {
    //   newErrors.endTime = "End time must be after start time";
    // }

    // if (
    //   formData.breakStartTime &&
    //   formData.breakEndTime &&
    //   formData.breakStartTime >= formData.breakEndTime
    // ) {
    //   newErrors.breakEndTime = "Break end time must be after break start time";
    // }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  //scroll to focus error field
  const scrollToFirstError = (
    errors: Partial<Record<keyof ShiftFormData, string>>,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const response = shiftId ? await updateShift(formData, shiftId) : await addShift(formData);

    if (response?.success) {
      navigate(pathNames.SHIFT);
    }
    setLoading(false);
  };

  const handleClose = () => {
    navigate(pathNames.SHIFT);
  };

  return (
    <>
      <TopBar
        title="Add Shift"
        actionButtons={
          <Button
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        }
      />

      <div className="content-area">
        <PageLoader loading={loading} />
        <form ref={formRef} method="POST" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:w-[50%] gap-5 md:grid-cols-2">
            <TextField
              label="Shift Name"
              name="name"
              value={formData.name}
              error={errors.name}
              placeholder="Enter Shift Name"
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <div />

            <TextField
              type="time"
              label="Shift Start Time"
              name="startTime"
              value={formData.startTime}
              error={errors.startTime}
              required
              onChange={(e) => handleChange("startTime", e.target.value)}
            />

            <TextField
              type="time"
              label="Shift End Time"
              name="endTime"
              value={formData.endTime}
              error={errors.endTime}
              required
              onChange={(e) => handleChange("endTime", e.target.value)}
            />

            <TextField
              type="time"
              label="Break Time Start"
              name="breakStartTime"
              value={formData.breakStartTime}
              error={errors.breakStartTime}
              required
              onChange={(e) => handleChange("breakStartTime", e.target.value)}
            />

            <TextField
              type="time"
              label="Break Time End"
              name="breakEndTime"
              value={formData.breakEndTime}
              error={errors.breakEndTime}
              required
              onChange={(e) => handleChange("breakEndTime", e.target.value)}
            />
          </div>

          <div className="mt-8 border-t border-borderPrimary pt-6">
            <div className="mb-5 flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-primary" />

              <h3 className="text-lg font-medium">
                Select Branch to Assign this Shift
              </h3>
            </div>

            {errors.branchIds && (
              <p className="mb-4 text-sm text-danger">{errors.branchIds}</p>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {branchLoading ? (
                <PageLoader loading={branchLoading} />
              ) : (
                branchList.map((branch) => {
                  const selected = formData.branchIds.includes(branch._id);

                  return (
                    <div
                      key={branch._id}
                      // onClick={() => handleBranchToggle(branch._id)}
                      className={`
                        cursor-pointer
                        border
                        p-2
                        transition-all
                        duration-200
                        ease-in
                        border-borderPrimary
                      `}
                    >
                      <div className="flex gap-3">
                        <Checkbox
                          name={branch.name}
                          checked={selected}
                          onChange={() => handleBranchToggle(branch._id)}
                        />

                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary text-sm">
                            {branch.name}{" "}{branch.branchType === branchEnum.HEAD_OFFICE ? "(HO)" : ""}
                          </h4>

                          <p className="mt-1 text-xs text-grayText">
                            {branch.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {!branchLoading && !branchList.length && (
                <div className="col-span-full rounded-md border border-dashed p-8 text-center">
                  No branches found
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button type="submit" name="Save" size="sm" />
            <Button name="Cancel" variant="secondary" size="sm" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddShift;
