import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { Link } from "react-router-dom";
import { IEducation } from "../../../onboarding/employee-details";
import { config } from "../../../../../../utils/config";

interface EductionDetailsProps {
  eductions: IEducation[];
}

const EductionDetails = ({ eductions }: EductionDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const educationColumns: ColumnDef<IEducation>[] = [
    {
      header: "Board/ University",
      className: "w-[40%] pr-2 pl-2",
      render: (education, index) => education.organization,
    },
    {
      header: "Passing Year",
      className: "w-[20%] pr-2 pl-2",
      render: (education, index) => education.passingYear,
    },

    {
      header: "Percentage (%)",
      className: "w-[20%] pr-2 pl-2",
      render: (education, index) => education.marks,
    },

    {
      header: "MarkSheet",
      className: "w-[5%] pr-2 pl-2",
      render: (education, index) => (
        <a
          href={`${config.BACKEND_API_URL}${education.document}`}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-solid fa-image text-primary"></i>
        </a>
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
            Eduction Details
          </h3>
        </div>
      }
    >
      <CustomTable columns={educationColumns} data={eductions} />
    </Accordion>
  );
};

export default EductionDetails;
