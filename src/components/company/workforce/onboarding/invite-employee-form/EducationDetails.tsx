import React from "react";
import { Trash2, Plus } from "lucide-react";
import { ColumnDef, CustomTable } from "../../../../common/table";
import TextField from "../../../../common/text-field/TextField";
import YearPicker from "../../../../common/date-picker/YearPicker";
import DocumentUpload from "../../../../common/document";
import Button from "../../../../common/button/Button";

export interface Education {
  organization: string;
  passingYear: string;
  marks: string;
  document: File | null;
}

interface Props {
  educations: Education[];
  errors: any;
  handleEducationChange: (
    index: number,
    field: keyof Education,
    value: string | File | null | number,
  ) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
}

const EducationDetails = ({
  educations,
  errors,
  handleEducationChange,
  addEducation,
  removeEducation,
}: Props) => {
  const columns: ColumnDef<Education>[] = [
    {
      header: "Board/ University",
      className: "w-[40%] pr-2 pl-2",
      render: (education, index) => (
        <TextField
          name="organization"
          value={education.organization}
          onChange={(e) =>
            handleEducationChange(index, "organization", e.target.value)
          }
          placeholder="Organization"
        />
      ),
    },
    {
      header: "Passing Year",
      className: "w-[20%] pr-2 pl-2",
      render: (education, index) => (
        <YearPicker
          value={Number(education.passingYear)}
          onChange={(value) =>
            handleEducationChange(index, "passingYear", value)
          }
          placeholder="Passing Year"
        />
      ),
    },

    {
      header: "Percentage  (%)",
      className: "w-[20%] pr-2 pl-2",
      render: (education, index) => (
        <TextField
          type="number"
          name="marks"
          value={education.marks}
          onChange={(e) =>
            handleEducationChange(index, "marks", e.target.value)
          }
          placeholder="Percentage (%)"
          max={100}
          min={0}
        />
      ),
    },

    {
      header: "MarkSheet",
      className: "w-[5%] pr-2 pl-2",
      render: (_, index) => (
        <DocumentUpload
          name="document"
          onChange={(file) =>
            handleEducationChange(index, "document", file || null)
          }
          label={""}
        />
      ),
    },
    {
      header: "",
      className: "w-[5%] pr-0 pl-0",
      render: (_, index) => {
        return (
            <>
          {index > 0 && <Button
            onClick={() => removeEducation(index)}
            variant="danger"
            size="sm"
            leftIcon={<i className="fa-solid text-secondary fa-xmark"></i>}
          />}
          </>
        );
      },
    },
  ];
  return (
    <div className="bg-transparent p-4">
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-xl text-white font-semibold">Education Details</h2>

        <Button
          name="Add Education"
          size="sm"
          onClick={addEducation}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <div className={`bg-white py-4`}>
        <CustomTable columns={columns} data={educations} />
      </div>
    </div>
  );
};

export default EducationDetails;
