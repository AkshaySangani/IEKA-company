import { useEffect, useRef, useState } from "react";
import Modal from "../../../common/modal/Modal";
import { getCompanyHierarchy } from "../../../../apis/organization/people-hierarchy.api";
import { IBranch, IShift } from "../onboarding/assign-roles-responsibility";
import { IOption } from "../../../../types/common-types";
import { IFilter, initialFilter } from ".";
import SelectField from "../../../common/select/SelectField";
import PageLoader from "../../../common/loader/PageLoader";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSearch: (filter: IFilter) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  handleSearch,
}: FilterModalProps) {
  const modalRef = useRef(null);
  const [filter, setFilter] = useState<IFilter>(initialFilter);
  const [departments, setDepartments] = useState<IOption[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOption[]>([]);
  const [shiftOptions, setShiftOptions] = useState<IOption[]>([]);
  const [shiftList, setShiftList] = useState<IShift[]>([]);
  const [branchLoading, setBranchLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBranchShiftDepartment();
    // eslint-disable-next-line
  }, []);

  const handleSelectFilter = (name: keyof IFilter, value: string) => {
    if (name === "branchId") {
      const shiftOption =
        branches.find((ele) => ele._id === value)?.shifts ?? [];
      setShiftList(shiftOption);
      setShiftOptions(
        shiftOption?.map((ele) => ({ label: ele?.name, value: ele?._id })),
      );
      setFilter((prev) => ({ ...prev, [name]: value, shiftId: "" }));
    } else if (name === "shiftId") {
      const departmentOption =
        shiftList
          .find((ele) => ele._id === value)
          ?.departments?.map((ele) => ({
            label: ele?.name,
            value: ele?._id,
          })) ?? [];
      setDepartments(departmentOption);
      setFilter((prev) => ({ ...prev, [name]: value, departmentId: "" }));
    } else {
      setFilter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchBranchShiftDepartment = async () => {
    setBranchLoading(true);
    const response = await getCompanyHierarchy();
    if (response?.success) {
      setBranches(response?.data?.list);
      const branchOption = response?.data?.list?.map((ele: IBranch) => ({
        label: ele?.name,
        value: ele?._id,
      }));
      setBranchOptions(branchOption);
    } else {
      setBranches([]);
      setBranchOptions([]);
      setShiftOptions([]);
    }
    setBranchLoading(false);
  };

  const handleConfirmFilter = () => {
    handleSearch(filter);
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      title={"Search"}
      onClose={() => {
        onClose();
        handleSearch(initialFilter);
        setFilter(initialFilter);
      }}
      handleOnConfirm={handleConfirmFilter}
      ref={modalRef}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
        <PageLoader loading={branchLoading} />
        <SelectField
          label="Branch"
          value={
            filter.branchId
              ? (branchOptions?.find((ele) => ele.value === filter.branchId) ??
                "")
              : ""
          }
          name={"branchId"}
          options={branchOptions}
          onChange={(option) => handleSelectFilter("branchId", option.value)}
          menuPortalTarget={modalRef.current}
        />
        <SelectField
          label="Shift"
          value={
            filter.shiftId
              ? (shiftOptions?.find((ele) => ele.value === filter.shiftId) ??
                "")
              : ""
          }
          name={"shiftId"}
          options={shiftOptions}
          onChange={(option) => handleSelectFilter("shiftId", option.value)}
          menuPortalTarget={modalRef.current}
        />
        <SelectField
          label="Department"
          value={
            filter.departmentId
              ? (departments?.find(
                  (ele) => ele.value === filter.departmentId,
                ) ?? "")
              : ""
          }
          name={"departmentId"}
          options={departments}
          onChange={(option) =>
            handleSelectFilter("departmentId", option.value)
          }
          menuPortalTarget={modalRef.current}
        />
      </div>
    </Modal>
  );
}
