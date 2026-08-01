import React from "react";
import { ICompanyDetails } from ".";
import Image from "../../common/image";
import { bankAccount, yesNo } from "../../../constants/constants";

interface Props {
  data: ICompanyDetails;
  handleCompanyOpen: () => void;
  handleAccountOpen: () => void;
}

const CompanyDetailCard: React.FC<Props> = ({
  data,
  handleCompanyOpen,
  handleAccountOpen,
}) => {
  return (
    <div className="content-card bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-primary p-2.5 flex items-center gap-4">
        <div className="w-[100px] bg-white flex items-center justify-center">
          {data.companyLogo && (
            <Image
              src={data.companyLogo}
              alt={data.companyName}
              className="max-h-16 object-contain"
            />
          )}
        </div>

        <h2 className="text-lg text-white font-medium">{data.companyName}</h2>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">
            Company Details
          </h3>

          <button onClick={handleCompanyOpen}>
            <i className="fa-solid fa-pen-to-square text-gray-500 text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          <Row
            label="Company Logo"
            value={
              data.companyLogo ? (
                <Image
                  src={data.companyLogo}
                  alt={data.companyName}
                  className="h-10 object-contain ml-auto"
                />
              ) : (
                "-"
              )
            }
          />

          <Row
            label="Company Name"
            value={
              <>
                {data.companyName}
                {/* {data.companyCode && (
                  <span className="ml-2 text-gray-500">
                    ({data.companyCode})
                  </span>
                )} */}
              </>
            }
          />

          <Row label="Address" value={data.companyAddress} />

          <Row
            label="Created Date"
            value={data.companyRepresentative.createdAt}
          />

          <Row label="Company Email" value={data.companyEmail} />

          <Row label="Company Phone No." value={data.companyPhone} />

          <Row label="GST IN No." value={data.gstin || "-"} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-medium">
            Accounting Details
          </h3>

          <button onClick={handleAccountOpen}>
            <i className="fa-solid fa-pen-to-square text-gray-500 text-lg" />
          </button>
        </div>

        <div className="space-y-4">
          <Row
            label="Account"
            value={
              <>
                {bankAccount[data.assignedBankAccount.accountType]}
                {/* {data.companyCode && (
                  <span className="ml-2 text-gray-500">
                    ({data.companyCode})
                  </span>
                )} */}
              </>
            }
          />

          <Row label="GST Include" value={yesNo[data.generateInvoiceWithGST]} />
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-sm justify-between gap-5 border-b border-gray-200 pb-3">
    <div className="text-gray-700">{label}</div>

    <div className="font-normal text-right max-w-[300px] line-clamp-2">
      {value}
    </div>
  </div>
);

export default CompanyDetailCard;
