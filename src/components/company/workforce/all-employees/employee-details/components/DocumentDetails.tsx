import { useState } from "react";
import Accordion from "../../../../../common/accordian";
import { ColumnDef, CustomTable } from "../../../../../common/table";
import { documentType } from "../../../../../../constants/constants";
import { IDocument } from "../../../onboarding/employee-details";
import { config } from "../../../../../../utils/config";
import Image from "../../../../../common/image";
import Modal from "../../../../../common/modal/Modal";

interface DocumentDetailsProps {
  documents: IDocument[];
}

const DocumentDetails = ({ documents }: DocumentDetailsProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");
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
      render: (document) =>
        document.front ? (
          <Image
            src={`${config.BACKEND_API_URL}${document.front}`}
            width={20}
            className="cursor-pointer"
            onClick={() =>
              setPreview(`${config.BACKEND_API_URL}${document.front}`)
            }
          />
        ) : (
          "-"
        ),
    },
    {
      header: "Back Pic",
      className: "w-[15%] pr-2 pl-2",
      render: (document) =>
        document.back ? (
          <Image
            src={`${config.BACKEND_API_URL}${document.front}`}
            width={20}
            className="cursor-pointer"
            onClick={() =>
              setPreview(`${config.BACKEND_API_URL}${document.front}`)
            }
          />
        ) : (
          "-"
        ),
    },
  ];
  return (
    <>
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
      <Modal
        width="max-w-xs"
        isOpen={preview !== ""}
        title={"Preview"}
        onClose={() => setPreview("")}
        showFooter={false}
      >
        <Image src={preview} width={300} height={300} />
      </Modal>
    </>
  );
};

export default DocumentDetails;
