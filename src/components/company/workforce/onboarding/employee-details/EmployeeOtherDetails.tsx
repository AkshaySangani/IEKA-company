import React from "react";
import Image from "../../../../common/image";
import { bankAccount, documentType } from "../../../../../constants/constants";
import { IDocument, IEducation, IEmployee, IEmployeeDetails, IExperience } from ".";
import { formatDate } from "../../../../../utils/date-format";
import DetailRow from "../../../../common/detail-row";
import { ColumnDef, CustomTable } from "../../../../common/table";
import { Link } from "react-router-dom";

interface Props {
  data: IEmployee;
  employeeDetails: IEmployeeDetails;
}

const EmployeeOtherDetailCard: React.FC<Props> = ({
  data,
  employeeDetails
}) => {
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
    <div className="content-card bg-white border border-gray-200">
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Education Details
          </h3>
        </div>
        <div>
            <CustomTable columns={educationColumns} data={employeeDetails.educations} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Experience Details
          </h3>
        </div>
        <div>
            <CustomTable columns={experienceColumns} data={employeeDetails.experiences} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Bank Details
          </h3>
        </div>

        <div className="space-y-4">
          <DetailRow
            label="Bank Name"
            value={"-"}
          />

          <DetailRow
            label="Account No."
            value={employeeDetails.bank.accountNo}
          />

          <DetailRow
            label="IAFC Code"
            value={employeeDetails.bank.ifscCode}
          />

          <DetailRow
            label="UAN No."
            value={"-"}
          />

          <DetailRow
            label="ESIC No."
            value={"-"}
          />

          <DetailRow
            label="PF Joining Date"
            value={"-"}
          />

          <DetailRow
            label="ESIC Joining Date"
            value={"-"}
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Personal Document Details
          </h3>
        </div>

        <div>
            <CustomTable columns={documentColumns} data={employeeDetails.documents} />
        </div>
      </div>
    </div>
  );
};



export default EmployeeOtherDetailCard;
