import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { Link } from "react-router-dom";
import { IEducation } from "../../../onboarding/employee-details";

interface EductionDetailsProps {
    eductions: IEducation[];
}

const EductionDetails = ({eductions}: EductionDetailsProps) => {
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
          <Link to={education.document} download target="_"><i className="fa-solid fa-file-invoice text-primary"></i></Link>
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