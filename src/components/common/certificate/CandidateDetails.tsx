import React from "react";
import { LetterData } from ".";
import TextField from "../text-field/TextField";

interface CandidateDetailsProps {
  title: string;
  data: LetterData;
  setData: React.Dispatch<React.SetStateAction<LetterData>>;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({
  title,
  data,
  setData,
}) => {
  const handleChange = (
    field: keyof LetterData,
    value: string | boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fields = [
    {
      label: "Candidate Name",
      key: "candidateName",
      showKey: "showCandidateName",
      type: "text",
      placeholder: "Enter candidate name",
    },
    {
      label: "Job Title",
      key: "jobTitle",
      showKey: "showJobTitle",
      type: "text",
      placeholder: "Enter job title",
    },
    {
      label: title === "Termination Letter" ? "Termination Date" : title === "Promotion Letter" ? "Promotion Date" : "Generation Date",
      key: "terminationDate",
      showKey: "showTerminationDate",
      type: "date",
    },
    ...(title === "Promotion Letter" ? [{
      label: "Promotion From",
      key: "promotionFrom",
      showKey: "showPromotionFrom",
      type: "text",
    },
    {
      label: "Promotion To",
      key: "promotionTo",
      showKey: "showPromotionTo",
      type: "text",
    },{
      label: "Effective Date",
      key: "effectiveDate",
      showKey: "showEffectiveDate",
      type: "date",
    },]:[]),
    ...(title !== "Promotion Letter" && title !== "Termination Letter" ? [
    {
      label: "Start Date",
      key: "joiningDate",
      showKey: "showJoiningDate",
      type: "date",
    },]:[]),
    {
      label: "Last Working Date",
      key: "lastWorkingDate",
      showKey: "showLastWorkingDate",
      type: "date",
    },
  ];

  return (
    <div className="content-card p-4">
        <h2 className="text-md font-semibold text-slate-800">
          Candidate Details
        </h2>

      <div className="space-y-3 mt-2 pl-2">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between">
            <div className="mb-2 flex items-center gap-2">
              <TextField
                type="checkbox"
                checked={data[field.showKey as keyof LetterData] as boolean}
                onChange={(e) =>
                  handleChange(
                    field.showKey as keyof LetterData,
                    e.target.checked
                  )
                }
              />

              <label className="text-sm font-normal text-gray-400">
                {field.label}
              </label>
            </div>

            <TextField
              type={field.type}
              value={data[field.key as keyof LetterData] as string}
              placeholder={field.placeholder}
              onChange={(e) =>
                handleChange(
                  field.key as keyof LetterData,
                  e.target.value
                )
              }
              className="h-8 !w-52"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateDetails;