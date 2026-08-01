import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { Link } from "react-router-dom";
import { documentType } from "../../../../../../constants/constants";
import { IDocument } from "../../../onboarding/employee-details";
import { config } from "../../../../../../utils/config";

interface DocumentDetailsProps {
  documents: IDocument[];
}

const DocumentDetails = ({ documents }: DocumentDetailsProps) => {
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
        <a
          href={`${config.BACKEND_API_URL}${document.front}`}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-solid fa-image text-primary"></i>
        </a>
      ),
    },
    {
      header: "Back Pic",
      className: "w-[15%] pr-2 pl-2",
      render: (document) =>
        document.back ? (
          <a
            href={`${config.BACKEND_API_URL}${document.back}`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-image text-primary"></i>
          </a>
        ) : (
          "-"
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
