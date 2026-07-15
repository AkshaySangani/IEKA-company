import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import TextField from "../../../common/text-field/TextField";

import {
  branchEnum,
  pathNames,
} from "../../../../constants/constants";
import PageLoader from "../../../common/loader/PageLoader";
import Checkbox from "../../../common/checkbox/CheckBox";
import { addDepartment, DepartmentFormData, getBranchAndShift, getDepartmentById, updateDepartment } from "../../../../apis/organization/department.api";
import { BranchType, statusEnum } from "../../../../types/common-types";

export interface IBranchShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface IBranchWithShifts {
  _id: string;
  name: string;
  address: string;
  branchType: BranchType;
  shifts: IBranchShift[];
}

export interface IDepartmentShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface IDepartmentBranch {
  _id: string;
  name: string;
  address: string;
}

export interface IDepartmentAssignment {
  _id: string;
  branchId: IDepartmentBranch;
  shiftIds: IDepartmentShift[];
}

export interface IDepartmentResponse {
  _id: string;
  companyId: string;
  name: string;
  assignments: IDepartmentAssignment[];
  status: statusEnum;
  createdAt: string;
  updatedAt: string;
}


const AddDepartment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { departmentId } =
    (location.state as {
      departmentId?: string;
    }) || {};

  const initialFormData: DepartmentFormData = {
    name: "",
    assignments: [],
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  const [branchList, setBranchList] = useState<IBranchWithShifts[]>([]);

  const [formData, setFormData] = useState<DepartmentFormData>(initialFormData);

  const [errors, setErrors] = useState<{
    name?: string;
    assignments?: string;
  }>({});

  useEffect(() => {
    fetchBranchList();
  }, []);

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentById(departmentId);
    }
  }, [departmentId]);

  // get department by id
  const fetchDepartmentById = async (departmentId: string) => {
    setLoading(true);
    const response = await getDepartmentById(departmentId);
    if (response.success) {
      const department: IDepartmentResponse = response.data;

      setFormData({
        name: department.name,
        assignments:
          department.assignments.map(
            (assignment) => ({
              branchId:
                assignment.branchId._id,
              shiftIds:
                assignment.shiftIds.map(ele => ele._id),
            }),
          ),
      });

    }
    setLoading(false);
  };

  // get branch with shifts
  const fetchBranchList = async () => {
    setBranchLoading(true);

    const response = await getBranchAndShift();

    if (response?.success) {
      setBranchList(response.data || []);
    } else {
      setBranchList([]);
    }
    setBranchLoading(false);
  };

  // handle change values
  const handleChange = (field: keyof DepartmentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // handle branch selection
  const handleBranchToggle = (branchId: string) => {
    setFormData((prev) => {
      const exists = prev.assignments.find((x) => x.branchId === branchId);

      if (exists) {
        return {
          ...prev,
          assignments: prev.assignments.filter((x) => x.branchId !== branchId),
        };
      }

      return {
        ...prev,
        assignments: [
          ...prev.assignments,
          {
            branchId,
            shiftIds: [],
          },
        ],
      };
    });

    setErrors((prev) => ({
      ...prev,
      assignments: "",
    }));
  };

  // handle shift selection
  const handleShiftToggle = (branchId: string, shiftId: string) => {
    setFormData((prev) => {
      const assignments = [...prev.assignments];

      const assignment = assignments.find((x) => x.branchId === branchId);

      if (!assignment) {
        setErrors(preErrors => ({...preErrors,assignments: "Please select branch first."}))
        return prev;
      }
      setErrors(preErrors => ({...preErrors,assignments: ""}))

      const exists = assignment.shiftIds.includes(shiftId);

      assignment.shiftIds = exists
        ? assignment.shiftIds.filter((id) => id !== shiftId)
        : [...assignment.shiftIds, shiftId];

      return {
        ...prev,
        assignments,
      };
    });

    setErrors((prev) => ({
      ...prev,
      assignments: "",
    }));
  };

  // check which branch selected
  const isBranchSelected = (branchId: string) =>
    formData.assignments.some((x) => x.branchId === branchId);

  // check which shift selected
  const isShiftSelected = (branchId: string, shiftId: string) => {
    const assignment = formData.assignments.find(
      (x) => x.branchId === branchId,
    );

    return assignment?.shiftIds.includes(shiftId) ?? false;
  };

  // handle validate fields
  const validate = () => {
    const newErrors: {
      name?: string;
      assignments?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    if (formData.assignments.length === 0) {
      newErrors.assignments = "Select at least one branch.";
    } else {
      const invalid = formData.assignments.find((a) => a.shiftIds.length === 0);

      if (invalid) {
        newErrors.assignments =
          "Every selected branch must have at least one shift.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      scrollToFirstError(newErrors);
      return false;
    }

    return true;
  };

  //scroll to focus error field
  const scrollToFirstError = (
    errors: Partial<Record<keyof DepartmentFormData, string>>,
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

  // handle submit for Save and Update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      assignments: formData.assignments,
    };

    const response =
      departmentId
        ? await updateDepartment(
            payload,
            departmentId,
          )
        : await addDepartment(
            formData,
          );

    if (response.success) {
      navigate(
        pathNames.DEPARTMENT,
      );
    }
  };

  const handleClose = () => {
    navigate(pathNames.DEPARTMENT);
  };

  return (
    <>
      <TopBar
        title="Add Department"
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
              label="Department Name"
              name="name"
              value={formData.name}
              error={errors.name}
              placeholder="Enter department name"
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <div />
          </div>

          <div className="mt-8 border-t border-borderPrimary pt-6">
            <div className="mb-5 flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-primary" />

              <h3 className="text-sm font-medium">
                Select Branch & Shift to Assign this Department
              </h3>
            </div>

            {errors.assignments && (
              <p className="mb-4 text-sm text-danger">{errors.assignments}</p>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {branchLoading ? (
                <PageLoader loading={branchLoading} />
              ) : (
                branchList.map((branch) => {
                  const branchSelected = isBranchSelected(branch._id);

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
                          checked={branchSelected}
                          onChange={() => handleBranchToggle(branch._id)}
                        />

                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary text-sm">
                            {branch.name}{" "}
                            {branch.branchType === branchEnum.HEAD_OFFICE
                              ? "(HO)"
                              : ""}
                          </h4>

                          <p className="mt-1 text-xs text-grayText">
                            {branch.address}
                          </p>
                          <div className=" mt-2 flex flex-wrap gap-4">
                            {branch.shifts.map((shift) => {
                              const selected = isShiftSelected(
                                branch._id,
                                shift._id,
                              );
                              return (
                                <Checkbox
                                  label={shift.name}
                                  name={shift.name}
                                  checked={selected}
                                  onChange={() => handleShiftToggle(branch._id,shift._id)}
                                />
                              );
                            })}
                          </div>
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

export default AddDepartment;
