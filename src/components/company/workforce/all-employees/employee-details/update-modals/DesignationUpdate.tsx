import { useEffect, useState } from "react";
import { IOption, statusEnum } from "../../../../../../types/common-types";
import ConfirmationHeader from "../../../../../common/confirmation-header";
import Modal from "../../../../../common/modal/Modal";
import RadioButton from "../../../../../common/radio-button";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { IDesignation } from "../../../../organization/designation";
import { getDesignation } from "../../../../../../apis/organization/designation.api";
import { IEmployee } from "..";
import PageLoader from "../../../../../common/loader/PageLoader";

interface DesignationUpdateProps {
  active: boolean;
  loading: boolean;
  employeeData: IEmployee;
  setActive: (value: boolean) => void;
  designationId: string;
  handleSubmit: (payload: any) => void;
}

interface DesignationFormData {
  designationId: string;
  remarks: string;
}
export default function DesignationUpdate({
  active,
  loading,
  employeeData,
  setActive,
  designationId,
  handleSubmit,
}: DesignationUpdateProps) {
  const [designations, setDesignations] = useState<IOption[]>([]);
  const initialFormData: DesignationFormData = {
    designationId: "",
    remarks: "",
  };

  const [designationLoading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] =
    useState<DesignationFormData>(initialFormData);
  useEffect(() => {
    if (designationId) {
      setFormData((prev) => ({ ...prev, designationId }));
    }
  }, [designationId]);
  useEffect(() => {
    if (employeeData?._id && active) {
      fetchDesignationList();
    }
  }, [employeeData?._id,active]);

  // get designation list
  const fetchDesignationList = async () => {
    setLoading(true);
    const response = await getDesignation({
      page: 1,
      limit: 200,
      status: statusEnum.ACTIVE,
    });
    if (response.success && response.data?.designations?.length > 0) {
      setDesignations(
        response.data?.designations?.map((ele: IDesignation) => ({
          label: ele?.name,
          value: ele?._id,
        })),
      );
    } else {
      setDesignations([]);
    }
    setLoading(false);
  };

  const handleChange = (field: keyof DesignationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnSubmit = async () => {
    const payload = {
      remarks: formData.remarks,
      designationId: formData.designationId,
    }
    await handleSubmit(payload);
  }
  return (
    <Modal
      isOpen={active}
      title={`${employeeData.firstName} ${employeeData?.lastName}`}
      width="max-w-2xl"
      onClose={() => setActive(false)}
      handleOnConfirm={handleOnSubmit}
      loading={loading}
    >
      <div className="flex flex-col gap-2">
        <PageLoader loading={designationLoading} />
        <ConfirmationHeader
          imageUrl={employeeData?.profileImage}
          title="Are you sure you want to update status for this employee?"
        />
        <RadioButton
          required
          label="Designation"
          name="designationId"
          value={formData.designationId}
          options={designations}
          onChange={(value) => handleChange("designationId", value)}
        />
        <TextAreaField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          placeholder="Enter remarks..."
          onChange={(e) => handleChange("remarks", e.target.value)}
        />
      </div>
    </Modal>
  );
}
