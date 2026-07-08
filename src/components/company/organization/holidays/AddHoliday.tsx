import { useEffect, useMemo, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import {
  addHoliday,
  updateHoliday,
} from "../../../../apis/organization/holidays.api";
import { IHoliday } from ".";
import { getDateDifferenceInDays } from "../../../../utils/date-format";
import YearPicker from "../../../common/date-picker/YearPicker";

interface IAddHolidayProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  fetchHolidayList: () => void;
  holiday: IHoliday;
}

interface HolidayFormData {
  name: string;
  description: string;
  effectiveYear: number;
  startDate: string;
  endDate: string;
}

const AddHoliday: React.FC<IAddHolidayProps> = ({
  isOpen,
  handleOpenClose,
  fetchHolidayList,
  holiday,
}) => {
  const [loading, setLoading] = useState(false);

  const initialFormData: HolidayFormData = {
    name: "",
    description: "",
    effectiveYear: new Date().getFullYear(),
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState<HolidayFormData>(initialFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof HolidayFormData, string>>
  >({});

  useEffect(() => {
    if (holiday?._id) {
      setFormData({
        name: holiday.name,
        description: holiday.description,
        effectiveYear: holiday.effectiveYear,
        startDate: holiday.startDate.split("T")[0],
        endDate: holiday.endDate.split("T")[0],
      });
    } else {
      setFormData(initialFormData);
    }
    // eslint-disable-next-line
  }, [holiday]);

  const handleChange = (
    field: keyof HolidayFormData,
    value: string | number,
  ) => {
    validate()
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const totalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;

    const diff = getDateDifferenceInDays(formData.startDate, formData.endDate);

    return diff > 0 ? diff : 0;
  }, [formData.startDate, formData.endDate]);

  const validate = () => {
    const newErrors: Partial<Record<keyof HolidayFormData, string>> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = formData.startDate ? new Date(formData.startDate) : null;

    const endDate = formData.endDate ? new Date(formData.endDate) : null;

    if (!formData.effectiveYear) {
      newErrors.effectiveYear = "Effective year is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Holiday name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate) {
      startDate.setHours(0, 0, 0, 0);

      // Only while adding
      if (!holiday._id && startDate < today) {
        newErrors.startDate = "Past dates are not allowed";
      }

      if (startDate.getFullYear() !== formData.effectiveYear) {
        newErrors.startDate = `Start date must be in ${formData.effectiveYear}`;
      }
    }

    if (endDate) {
      endDate.setHours(0, 0, 0, 0);

      if (endDate.getFullYear() !== formData.effectiveYear) {
        newErrors.endDate = `End date must be in ${formData.effectiveYear}`;
      }
    }

    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate =
        "End date should be greater than or equal to start date";
    }

    // if (!formData.description.trim()) {
    //   newErrors.description = "Description is required";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      effectiveYear: Number(formData.effectiveYear),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    const response = holiday?._id
      ? await updateHoliday(payload, holiday._id)
      : await addHoliday(payload);

    if (response.success) {
      fetchHolidayList();
      resetForm();
      handleOpenClose();
    }

    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    handleOpenClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={holiday?._id ? "Edit Holiday" : "Add Holiday"}
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      handleOnConfirm={handleSubmit}
    >
      <div className="grid grid-cols-1 w-[75%] gap-4">
        <YearPicker
          label="Effective Year"
          required
          value={formData.effectiveYear}
          error={errors.effectiveYear}
          placeholder="Enter effective year"
          onChange={(year) => handleChange("effectiveYear", year)}
        />

        <TextField
          label="Holiday Name"
          required
          value={formData.name}
          error={errors.name}
          placeholder="Enter holiday name"
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            type="date"
            label="Start Date"
            required
            value={formData.startDate}
            error={errors.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max={
              formData.effectiveYear
                ? `${formData.effectiveYear}-12-31`
                : undefined
            }
          />

          <TextField
            type="date"
            label="End Date"
            required
            value={formData.endDate}
            error={errors.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            min={
              formData.startDate
                ? formData.startDate
                : new Date().toISOString().split("T")[0]
            }
            max={
              formData.effectiveYear
                ? `${formData.effectiveYear}-12-31`
                : undefined
            }
          />
        </div>

        <TextField
          label="Total Days"
          value={totalDays ? `${totalDays} Day${totalDays > 1 ? "s" : ""}` : ""}
          disabled
        />

        <TextAreaField
          name="description"
          label="Description"
          // required
          value={formData.description}
          error={errors.description}
          placeholder="Enter description"
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default AddHoliday;
