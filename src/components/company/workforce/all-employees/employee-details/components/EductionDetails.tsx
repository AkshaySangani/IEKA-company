import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { IEducation, IEmployee } from "../../../onboarding/employee-details";
import { config } from "../../../../../../utils/config";
import { downloadFile } from "../../../../../../utils/helper";

interface EductionDetailsProps {
  employee: IEmployee;
  eductions: IEducation[];
}

const EductionDetails = ({ eductions, employee }: EductionDetailsProps) => {
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
        <i
          className="fa-solid fa-image text-primary"
          onClick={() =>
            downloadFile(
              `${config.BACKEND_API_URL}${education.document}`,
              `${employee.firstName}_${employee.lastName}_MarkSheet`,
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
