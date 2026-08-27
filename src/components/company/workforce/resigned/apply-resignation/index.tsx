import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "../../../../../store/auth-store";
import {
  ApplyResignationProps,
  IResignationErrors,
  IResignationForm,
} from "../../../../../types/employee/resignation.types";
import {
  addResignation,
  getResignedEmployeeById,
} from "../../../../../apis/workforce/resigned.api";
import { DateFormat, formatDate } from "../../../../../utils/date-format";
import Modal from "../../../../common/modal/Modal";
import Image from "../../../../common/image";
import TextField from "../../../../common/text-field/TextField";
import TextAreaField from "../../../../common/text-area/TextAreaField";
import Button from "../../../../common/button/Button";
import UserImage from "../../../../../assets/images/User-Image.png";
import PageLoader from "../../../../common/loader/PageLoader";

export default function ApplyResignation({
  show,
  handleOpenClose,
  resignationId
}: ApplyResignationProps) {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<IResignationForm>({
    userId: user?._id,
    lastWorkingDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<IResignationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect for fetch resignation
  useEffect(() => {
    if (resignationId) {
      fetchEmployeeResignation(resignationId);
    }
    // eslint-disable-next-lines
  }, [resignationId]);

  // fetch employee resignation
  const fetchEmployeeResignation = async (id: string) => {
    setLoading(true);
    const response = await getResignedEmployeeById(id);
    if(response.success){
      setFormData(prev => ({
        ...prev,
        reason: response?.data?.reason,
        lastWorkingDate: formatDate(response?.data?.lastWorkingDate, DateFormat.ISO_DATE)
      }))
    }
    setLoading(false);
  };

  // ---------------------------------------------
  // Handle open / close modal
  // ---------------------------------------------
  const handleResetForm = () => {
    if (show) {
      handleOpenClose();
      resetForm();
    }
  };

  // ---------------------------------------------
  // Handle input change
  // ---------------------------------------------
  const handleChange = (
    field: keyof Omit<IResignationForm, "userId">,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error while typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // ---------------------------------------------
  // Validation
  // ---------------------------------------------
  const validateForm = (): boolean => {
    const newErrors: IResignationErrors = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for leaving is required.";
    } else if (formData.reason.trim().length < 3) {
      newErrors.reason = "Reason must be at least 3 characters.";
    }

    if (!formData.lastWorkingDate) {
      newErrors.lastWorkingDate = "Last working date is required.";
    } else {
      const selectedDate = new Date(formData.lastWorkingDate);
      const today = new Date();

      // Remove time from today's date
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.lastWorkingDate = "Last working date cannot be in the past.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------
  // Reset form
  // ---------------------------------------------
  const resetForm = () => {
    setFormData({
      userId: user?._id || "",
      lastWorkingDate: "",
      reason: "",
    });

    setErrors({});
  };

  // ---------------------------------------------
  // Handle submit
  // ---------------------------------------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        userId: user._id,

        // Convert yyyy-mm-dd to ISO date
        lastWorkingDate: formatDate(
          formData.lastWorkingDate,
          DateFormat.ISO_DATE,
        ),

        reason: formData.reason.trim(),
      };

      /*
       * API call here
       */
      const response = await addResignation(payload);

      // After successful API call
      if (response.success) {
        handleResetForm();
      }
    } catch (error) {
      console.error("Failed to apply resignation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={show}
      title="Apply Resignation"
      onClose={handleResetForm}
      width="max-w-xl"
      showFooter={false}
    >
      <form onSubmit={handleSubmit}>
        {/* Employee */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center relative">
          <PageLoader loading={loading}/>
          <Image
            src={user.profileImage}
            fallbackSrc={UserImage}
            alt="User Profile"
            className="h-[80px] w-[80px] rounded-full border border-[#ddd] object-cover"
          />
          <h3 className="text-lg font-medium text-slate-800">
            {`${user.firstName} ${user.lastName}`}
          </h3>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4">
          {/* Reason */}
          <TextAreaField
            label="Reason for Leaving"
            required
            name="reason"
            value={formData.reason}
            placeholder="Enter reason for leaving..."
            onChange={(event) => handleChange("reason", event.target.value)}
            error={errors.reason}
          />

          {/* Last Working Date */}
          <TextField
            type="date"
            label="Last Working Date"
            required
            name="lastWorkingDate"
            value={formData.lastWorkingDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(event) =>
              handleChange("lastWorkingDate", event.target.value)
            }
            error={errors.lastWorkingDate}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-2 border-t border-inputBorder pt-4">
          <Button
            type="submit"
            name={"Save"}
            size="sm"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            name="Cancel"
            variant="secondary"
            size="sm"
            onClick={handleResetForm}
          />
        </div>
      </form>
    </Modal>
  );
}
