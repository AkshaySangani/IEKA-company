import Button from "../../../../common/button/Button";
import TextField from "../../../../common/text-field/TextField";
import DocumentUpload from "../../../../common/document";
import { ColumnDef, CustomTable } from "../../../../common/table";

export interface Experience {
  organization: string;
  designation: string;
  startDate: string;
  endDate: string;
  document: File | null;
}

interface Props {
  experiences: Experience[];
  errors: any;
  handleExperienceChange: (
    index: number,
    field: keyof Experience,
    value: string | File | null,
  ) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
}

const ExperienceDetails = ({
  experiences,
  errors,
  handleExperienceChange,
  addExperience,
  removeExperience,
}: Props) => {
  const columns: ColumnDef<Experience>[] = [
    {
      header: "Organization",
      className: "w-[25%] pr-2 pl-2",
      render: (experience, index) => (
        <TextField
          name="organization"
          value={experience.organization}
          onChange={(e) =>
            handleExperienceChange(index, "organization", e.target.value)
          }
          placeholder="Organization"
        />
      ),
    },
    {
      header: "Position",
      className: "w-[25%] pr-2 pl-2",
      render: (experience, index) => (
        <TextField
          name="designation"
          value={experience.designation}
          onChange={(e) =>
            handleExperienceChange(index, "designation", e.target.value)
          }
          placeholder="Designation"
        />
      ),
    },
    {
      header: "Start Date",
      className: "w-[20%] pr-2 pl-2",
      render: (experience, index) => (
        <TextField
          type="date"
          name="startDate"
          value={experience.startDate}
          onChange={(e) =>
            handleExperienceChange(index, "startDate", e.target.value)
          }
          placeholder="Start Date"
        />
      ),
    },
    {
      header: "End Date",
      className: "w-[20%] pr-2 pl-2",
      render: (experience, index) => (
        <TextField
          type="date"
          name="endDate"
          value={experience.endDate}
          onChange={(e) =>
            handleExperienceChange(index, "endDate", e.target.value)
          }
          min={experience.startDate}
          placeholder="End Date"
        />
      ),
    },
    {
      header: "Experience Letter",
      className: "w-[5%] pr-2 pl-2",
      render: (_, index) => (
        <DocumentUpload
          name="document"
          onChange={(file) =>
            handleExperienceChange(index, "document", file || null)
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
            onClick={() => removeExperience(index)}
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
        <h2 className="text-xl text-white font-semibold">Experience Details</h2>

        <Button
          name="Add Experience"
          size="sm"
          onClick={addExperience}
          leftIcon={<i className="fa-solid fa-plus"></i>}
        />
      </div>

      <div className={`bg-white py-4`}>
        <CustomTable columns={columns} data={experiences} />
      </div>
    </div>
  );
};

export default ExperienceDetails;
