import React from "react";
import { LetterData } from ".";
import TextField from "../text-field/TextField";
import ImageUpload from "../image-upload";
import TextAreaField from "../text-area/TextAreaField";

interface CompanyDetailsProps {
  data: LetterData;
  setData: React.Dispatch<React.SetStateAction<LetterData>>;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ data, setData }) => {
  const handleChange = (field: keyof LetterData, value: string | boolean) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      handleChange("logo", reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const fields = [
    {
      label: "Authorized Person",
      key: "authPerson",
      showKey: "showAuthPerson",
      placeholder: "Enter authorized person",
    },
    {
      label: "Designation",
      key: "designation",
      showKey: "showDesignation",
      placeholder: "Enter designation",
    },
    {
      label: "Address",
      key: "address",
      showKey: "showAddress",
      textarea: true,
      placeholder: "Enter address",
    },
    {
      label: "Contact Number",
      key: "contact",
      showKey: "showContact",
      placeholder: "Enter contact number",
    },
    {
      label: "Email",
      key: "email",
      showKey: "showEmail",
      placeholder: "Enter email",
    },
    {
      label: "Website",
      key: "website",
      showKey: "showWebsite",
      placeholder: "Enter website",
    },
  ];

  return (
    <div className="content-card p-4">
      <h2 className="text-md font-semibold text-slate-800">
        Candidate Details
      </h2>

      <div className="space-y-3 mt-2 pl-2">
        {/* Company Logo */}

        <div className="">
          <div className="mb-2 flex items-center gap-2">
            <TextField
              type="checkbox"
              checked={data.showLogo}
              onChange={(e) => handleChange("showLogo", e.target.checked)}
            />

            <label className="text-sm font-normal text-gray-400">
              Company Logo
            </label>
          </div>

          <div className="flex items-center gap-3">
            <ImageUpload onChange={handleLogoChange} label={""} />
          </div>
        </div>

        {/* Other Fields */}

        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between">
            <div className="mb-2 flex items-center gap-2">
              <TextField
                type="checkbox"
                checked={data[field.showKey as keyof LetterData] as boolean}
                onChange={(e) =>
                  handleChange(
                    field.showKey as keyof LetterData,
                    e.target.checked,
                  )
                }
              />

              <label className="text-sm font-normal text-gray-400">
                {field.label}
              </label>
            </div>

            {field.textarea ? (
              <TextAreaField
                rows={3}
                value={data[field.key as keyof LetterData] as string}
                placeholder={field.placeholder}
                onChange={(e) =>
                  handleChange(field.key as keyof LetterData, e.target.value)
                }
                name={""}
                className="!w-52"
              />
            ) : (
              <TextField
                type="text"
                value={data[field.key as keyof LetterData] as string}
                placeholder={field.placeholder}
                onChange={(e) =>
                  handleChange(field.key as keyof LetterData, e.target.value)
                }
                className="h-8 !w-52"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDetails;
