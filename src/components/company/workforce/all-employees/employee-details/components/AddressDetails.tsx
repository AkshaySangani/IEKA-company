import { useState } from "react";
import DetailRow from "../../../../../common/detail-row";
import Accordion from "../../../../../common/accordian";
import Modal from "../../../../../common/modal/Modal";
import TextAreaField from "../../../../../common/text-area/TextAreaField";
import { IEmployee } from "../../../onboarding/employee-details";

interface AddressDetailsProps {
  employee: IEmployee;
  loading: boolean;
  handleSubmit: (formData: FormData) => void;
}

const AddressDetails = ({employee, loading, handleSubmit}: AddressDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  
    const initialFormData = {
      address: "",
      permanentAddress: "",
    };
  
    const [formData, setFormData] = useState(initialFormData);
  
    const handleClickOnEdit = (
      e: React.MouseEvent<HTMLButtonElement>,
    ) => {
      e.stopPropagation();
  
      setOpen((prev) => {
        if (!prev) {
          setFormData({
            address: employee.address,
            permanentAddress: employee.permanentAddress,
          });
  
          setErrors({});
        }
  
        return !prev;
      });
    };
  
    const handleClose = () => {
      setOpen(false);
      setFormData(initialFormData);
    };
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target;
  
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    };
  
    const validate = () => {
      const newErrors: Record<string, string> = {};
  
      if (!formData.address.trim()) {
        newErrors.fatherName = "Address is required";
      }
  
      setErrors(newErrors);
  
      return Object.keys(newErrors).length === 0;
    };
  
    const handleOnSubmit = async () => {
      if (!validate()) return;
  
      const form = new FormData();
  
      form.append("permanentAddress", formData.permanentAddress);
      form.append("address", formData.address);
      
      try {
        await handleSubmit(form);
  
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <>
    <Accordion
      active={active}
      setActive={setActive}
      header={
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-pen-to-square text-gray-400" onClick={handleClickOnEdit}></i>
          <h3 className="text-md text-gray-600 font-semibold">
            Address Details
          </h3>
        </div>
      }
    >
      <div className="space-y-2">
        <DetailRow label="Current Address" value={employee.address} />

        <DetailRow
          label="Permanent Address"
          value={employee.permanentAddress}
        />
      </div>
    </Accordion>
    <Modal isOpen={open} title={"Address Details"} loading={loading} onClose={handleClose} handleOnConfirm={handleOnSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white">
          <TextAreaField
            label="Current Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Enter Current Address"
            required
          />
          <TextAreaField
            label="Permanent Address"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            error={errors.permanentAddress}
            placeholder="Enter Permanent Address"
            // required
          />
        </div>
      </Modal>
    </>
  );
};

export default AddressDetails;