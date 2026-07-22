import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { Link } from "react-router-dom";
import { documentType } from "../../../../../../constants/constants";
import { IDocument } from "../../../onboarding/employee-details";

interface DocumentDetailsProps {
    documents: IDocument[];
}

const DocumentDetails = ({documents}: DocumentDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const documentColumns: ColumnDef<IDocument>[] = [
    {
      header: "Document Name",
      className: "w-[40%] pr-2 pl-2",
      render: (document) => documentType[document.card],
    },
    {
      header: "No",
      className: "w-[30%] pr-2 pl-2",
      render: (document) => document.cardNumber,
    },
    {
      header: "Front Pic",
      className: "w-[15%] pr-2 pl-2",
      render: (document) => (
        <Link to={document.front} download target="_"><i className="fa-solid fa-image text-primary"></i></Link>
      ),
    },
    {
      header: "Back Pic",
      className: "w-[15%] pr-2 pl-2",
      render: (document) => document.back ? (
        <Link to={document.front} download target="_"><i className="fa-solid fa-image text-primary"></i></Link>
      ): "-",
    }
  ];
  return (
    <Accordion
      active={active}
      setActive={setActive}
      header={
        <div className="flex items-center gap-2">
          <h3 className="text-md text-gray-600 font-semibold">
            Personal Document Details
          </h3>
        </div>
      }
    >
      <CustomTable columns={documentColumns} data={documents} />
    </Accordion>
  );
};

export default DocumentDetails;