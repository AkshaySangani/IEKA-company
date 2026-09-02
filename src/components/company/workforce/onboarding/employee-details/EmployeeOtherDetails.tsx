import React, { useState } from "react";
import { documentType } from "../../../../../constants/constants";
import {
  IDocument,
  IEducation,
  IEmployee,
  IEmployeeDetails,
  IExperience,
} from ".";
import { formatDate } from "../../../../../utils/date-format";
import DetailRow from "../../../../common/detail-row";
import { ColumnDef, CustomTable } from "../../../../common/table";
import { config } from "../../../../../utils/config";
import { downloadFile } from "../../../../../utils/helper";
import Image from "../../../../common/image";
import Modal from "../../../../common/modal/Modal";

interface Props {
  data: IEmployee;
  employeeDetails: IEmployeeDetails;
}

const EmployeeOtherDetailCard: React.FC<Props> = ({
  data,
  employeeDetails,
}) => {
  const [preview, setPreview] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const educationColumns: ColumnDef<IEducation>[] = [
    {
      header: "Board/ University",
      className: "pr-2 pl-2",
      render: (education, index) => education.organization,
    },
    {
      header: "Passing Year",
      className: "pr-2 pl-2",
      render: (education, index) => education.passingYear,
    },

    {
      header: "Percentage (%)",
      className: "pr-2 pl-2",
      render: (education, index) => education.marks,
    },

    {
      header: "MarkSheet",
      className: "pr-2 pl-2",
      render: (education, index) => (
        <i
          className="fa-solid fa-image cursor-pointer text-primary"
          onClick={() =>
            downloadFile(
              `${config.BACKEND_API_URL}${education.document}`,
              `${data.firstName}_${data.lastName}_MarkSheet`,
            )
          }
        ></i>
      ),
    },
  ];

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
          className="fa-solid fa-image cursor-pointer text-primary"
          onClick={() =>
            downloadFile(
              `${config.BACKEND_API_URL}${experience.document}`,
              `${data.firstName}_${data.lastName}_Experience_Letter`,
            )
          }
        ></i>
      ),
    },
  ];

  const documentColumns: ColumnDef<IDocument>[] = [
    {
      header: "Document Name",
      className: "pr-2 pl-2",
      render: (document) => documentType[document.card],
    },
    {
      header: "No",
      className: "pr-2 pl-2",
      render: (document) => document.cardNumber,
    },
    {
      header: "Front Pic",
      className: "pr-2 pl-2",
      render: (document) => document.front ? (
          <Image
            src={`${config.BACKEND_API_URL}${document.front}`}
            width={20}
            className="cursor-pointer"
            onClick={() =>{
              setPreview(`${config.BACKEND_API_URL}${document.front}`);
              setFileName(`${documentType[document.card]}_front`);
            }}
          />
        ) : (
          "-"
        ),
    },
    {
      header: "Back Pic",
      className: "pr-2 pl-2",
      render: (document) =>
        document.back ? (
          <Image
            src={`${config.BACKEND_API_URL}${document.back}`}
            width={20}
            className="cursor-pointer"
            onClick={() =>{
              setPreview(`${config.BACKEND_API_URL}${document.back}`);
              setFileName(`${documentType[document.card]}_back`);
            }}
          />
        ) : (
          "-"
        ),
    },
  ];

  const handleDownloadFile = () => {
    downloadFile(preview,fileName);
  }
  return (
    <div className="content-card bg-white border border-gray-200">
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">
            Education Details
          </h3>
        </div>
        <div>
          <CustomTable
            columns={educationColumns}
            data={employeeDetails.educations}
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">
            Experience Details
          </h3>
        </div>
        <div>
          <CustomTable
            columns={experienceColumns}
            data={employeeDetails.experiences}
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">Bank Details</h3>
        </div>

        <div className="space-y-4">
          <DetailRow
            label="Bank Name"
            value={
              employeeDetails.bank.bankName
                ? employeeDetails.bank.bankName
                : "-"
            }
          />

          <DetailRow
            label="Account No."
            value={employeeDetails.bank.accountNo ? employeeDetails.bank.accountNo : "-"}
          />

          <DetailRow label="IFSC Code" value={employeeDetails.bank.ifscCode ? employeeDetails.bank.ifscCode : "-"} />

          <DetailRow
            label="UAN No."
            value={
              employeeDetails.bank.uanNo ? employeeDetails.bank.uanNo : "-"
            }
          />

          <DetailRow
            label="ESIC No."
            value={
              employeeDetails.bank.esicNo ? employeeDetails.bank.esicNo : "-"
            }
          />

          <DetailRow
            label="PF Joining Date"
            value={
              employeeDetails.bank.pfJoiningDate
                ? formatDate(employeeDetails.bank.pfJoiningDate)
                : "-"
            }
          />

          <DetailRow
            label="ESIC Joining Date"
            value={
              employeeDetails.bank.esicJoiningDate
                ? formatDate(employeeDetails.bank.esicJoiningDate)
                : "-"
            }
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">
            Personal Document Details
          </h3>
        </div>

        <div>
          <CustomTable
            columns={documentColumns}
            data={employeeDetails.documents}
          />
        </div>
      </div>
      <Modal
        width="max-w-xs"
        isOpen={preview !== ""}
        title={"Preview"}
        onClose={() => setPreview("")}
        showFooter={false}
        isDownload
        onDownload={handleDownloadFile}
      >
        <Image src={preview} width={300} height={300} />
      </Modal>
    </div>
  );
};

export default EmployeeOtherDetailCard;
