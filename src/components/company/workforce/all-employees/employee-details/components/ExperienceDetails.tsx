import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { formatDate } from "../../../../../../utils/date-format";
import { IEmployee, IExperience } from "../../../onboarding/employee-details";
import { config } from "../../../../../../utils/config";
import { downloadFile } from "../../../../../../utils/helper";

interface ExperienceDetailsProps {
  employee: IEmployee;
  experiences: IExperience[];
}

const ExperienceDetails = ({
  experiences,
  employee,
}: ExperienceDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const experienceColumns: ColumnDef<IExperience>[] = [
    {
      header: "Organization",
      className: "pr-2 pl-2",
      render: (experience) => experience.organization,
    },
    {
      header: "Start Date",
      className: "pr-2 pl-2",
      render: (experience) => formatDate(experience.startDate),
    },
    {
      header: "End Date",
      className: "pr-2 pl-2",
      render: (experience) => formatDate(experience.endDate),
    },
    {
      header: "Position",
      className: "pr-2 pl-2",
      render: (experience) => experience.designation,
    },

    {
      header: "Document",
      className: "pr-2 pl-2",
      render: (experience) => (
        <i
          className="fa-solid fa-image text-primary"
          onClick={() =>
            downloadFile(
              `${config.BACKEND_API_URL}${experience.document}`,
              `${employee.firstName}_${employee.lastName}_Experience_Letter`,
            )
          }
        ></i>
      ),
    },
  ];
  return (
    <Accordion
      active={active}
      setActive={setActive}
      header={
        <div className="flex items-center gap-2">
          <h3 className="text-md text-gray-600 font-medium">
            Experience Details
          </h3>
        </div>
      }
    >
      <CustomTable columns={experienceColumns} data={experiences} />
    </Accordion>
  );
};

export default ExperienceDetails;
