import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../../../utils/date-format";
import { IExperience } from "../../../onboarding/employee-details";

interface ExperienceDetailsProps {
    experiences: IExperience[];
}

const ExperienceDetails = ({experiences}: ExperienceDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
   const experienceColumns: ColumnDef<IExperience>[] = [
      {
        header: "Organization",
        className: "w-[25%] pr-2 pl-2",
        render: (experience) => experience.organization,
      },
      {
        header: "Start Date",
        className: "w-[20%] pr-2 pl-2",
        render: (experience) => formatDate(experience.startDate),
      },
      {
        header: "End Date",
        className: "w-[20%] pr-2 pl-2",
        render: (experience) => formatDate(experience.endDate),
      },
      {
        header: "Position",
        className: "w-[30%] pr-2 pl-2",
        render: (experience) => experience.designation,
      },
      
      {
        header: "Document",
        className: "w-[5%] pr-2 pl-2",
        render: (experience) => (
          <Link to={experience.document} download target="_"><i className="fa-solid fa-file-invoice text-primary"></i></Link>
        ),
      }
    ];
  return (
    <Accordion
      active={active}
      setActive={setActive}
      header={
        <div className="flex items-center gap-2">
          <h3 className="text-md text-gray-600 font-semibold">
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