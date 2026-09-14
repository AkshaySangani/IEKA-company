import React, { useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import ImageUpload from "../../common/image-upload";
import TextField from "../../common/text-field/TextField";
import { ICompanyDetails } from ".";
import { updateProfile } from "../../../apis/admin/my-profile";
import Image from "../../common/image";
import DetailRow from "../../common/detail-row";
import TextAreaField from "../../common/text-area/TextAreaField";
import { regex } from "../../../constants/validation-regex";

interface CompanyDetailsProps {
  companyDetails: ICompanyDetails;
  getAdminProfile: () => void;
}

interface CompanyDetailForm {
  companyName: string;
  companyEmail: string;
  gstin: string;
  companyLogo: File | string | null;
  companyAddress: string;
  companyPhone: number;
}

interface FormErrors {
  companyName?: string;
  companyEmail?: string;
  gstin?: string;
  companyLogo?: string;
  companyPhone?: string;
}

const CompanyDetailsCard: React.FC<CompanyDetailsProps> = ({
  companyDetails,
  getAdminProfile,
}: CompanyDetailsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [companyDetail, setCompanyDetail] = useState<CompanyDetailForm>({
    companyName: companyDetails?.companyName || "",
    companyEmail: companyDetails?.companyEmail || "",
    gstin: companyDetails?.gstin || "",
    companyLogo: companyDetails?.companyLogo || null,
    companyAddress: companyDetails.companyAddress,
    companyPhone: companyDetails.companyPhone
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // sync when modal open
  useEffect(() => {
    if (isOpen) {
      setCompanyDetail({
        companyName: companyDetails?.companyName || "",
        companyEmail: companyDetails?.companyEmail || "",
        gstin: companyDetails?.gstin || "",
        companyLogo: companyDetails?.companyLogo || null,
        companyAddress: companyDetails.companyAddress,
        companyPhone: companyDetails.companyPhone
      });

      setErrors({});
    }
  }, [isOpen, companyDetails]);

  // handle close edit modal
  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };

  // handle change values
  const handleChange = (value: any, name: keyof CompanyDetailForm) => {
    setCompanyDetail((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // validate fields
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!companyDetail.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!companyDetail.companyLogo) {
      newErrors.companyLogo = "Company Logo is required";
    }

    if (
      companyDetail.companyPhone &&
      !regex.phone.test(String(companyDetail.companyPhone))
    ) {
      newErrors.companyPhone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // handle submit for update
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("companyName", companyDetail.companyName);
    companyDetail.companyEmail &&
      formData.append("companyEmail", companyDetail.companyEmail);
    companyDetail.companyPhone &&
      formData.append("companyPhone", String(companyDetail.companyPhone));
    companyDetail.companyAddress &&
      formData.append("companyAddress", companyDetail.companyAddress);
    formData.append("gstin", companyDetail.gstin);

    if (companyDetail.companyLogo) {
      formData.append("companyLogo", companyDetail.companyLogo);
    }

    const response = await updateProfile(formData);

    if (response?.success) {
      setIsOpen(false);
      getAdminProfile();
    }

    setLoading(false);
  };

  return (
    <>
      <div className="content-card border flex flex-col gap-2 p-2 sm:p-4">
        <div className="bg-primary p-2.5 flex items-center gap-4">
          <div className="bg-white">
            <Image
              src={companyDetails.companyLogo}
              alt={companyDetails.companyName}
              className="w-28
            h-18
            min-w-28
            min-h-18
            shrink-0
            object-contain"
            />
          </div>
          <div className="">
            <h2 className="text-lg text-white font-medium">
              {companyDetail.companyName}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between pb-2 border-b text-secondary font-medium">
            <h2>Company Details</h2>
            <div onClick={() => setIsOpen((prev) => !prev)}>
              <i className="fa-solid fa-pen-to-square cursor-pointer text-secondary/60"></i>
            </div>
          </div>
          <DetailRow
            label={"Company Email"}
            value={companyDetail.companyEmail}
          />
          <DetailRow
            label={"Company Phone No."}
            value={companyDetail.companyPhone}
          />
          <DetailRow
            label={"Company Address"}
            value={companyDetail.companyAddress}
          />
          <DetailRow label={"GST IN No."} value={companyDetail.gstin} />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        title={"Edit Company Details"}
        onClose={handleClose}
        handleOnConfirm={handleSubmit}
        confirmButtonName="Save"
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Logo */}
          <ImageUpload
            label="Company Logo"
            value={companyDetail?.companyLogo}
            required
            onChange={(file) => {
              handleChange(file, "companyLogo");
            }}
            error={errors.companyLogo}
          />

          {/* Empty column for alignment */}
          <div></div>

          {/* Company Name */}
          <TextField
            required
            label="Company Name"
            placeholder="Enter company name"
            value={companyDetail.companyName}
            error={errors.companyName}
            onChange={(e) => handleChange(e.target.value, "companyName")}
          />

          {/* Company Email */}
          <TextField
            label="Company Email"
            placeholder="Enter company email"
            value={companyDetail.companyEmail}
            onChange={(e) => handleChange(e.target.value, "companyEmail")}
          />

          <TextField
            label="Company Phone No."
            type="number"
            min={10}
            placeholder="Enter company phone no."
            value={companyDetail.companyPhone}
            onChange={(e) => handleChange(e.target.value, "companyPhone")}
          />

          {/* GST Number */}
          <TextField
            label="GST IN Number"
            placeholder="Enter GST Number"
            value={companyDetail.gstin}
            onChange={(e) => handleChange(e.target.value, "gstin")}
          />

          {/* Address */}
          <TextAreaField
            label="Company Address"
            name={"companyAddress"}
            placeholder="Enter GST Number"
            value={companyDetail.companyAddress}
            onChange={(e) => handleChange(e.target.value, "companyAddress")}
          />
        </div>
      </Modal>
    </>
  );
};

export default CompanyDetailsCard;
