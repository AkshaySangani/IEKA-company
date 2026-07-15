import React from "react";
import Image from "../../../../common/image";
import { bankAccount } from "../../../../../constants/constants";
import { IEmployee, IEmployeeDetails } from ".";
import { formatDate } from "../../../../../utils/date-format";
import DetailRow from "../../../../common/detail-row";

interface Props {
  data: IEmployee;
  employeeDetails: IEmployeeDetails;
}

const EmployeeDetailCard: React.FC<Props> = ({
  data,
  employeeDetails
}) => {
  return (
    <div className="content-card bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-primary p-2.5 flex items-center gap-4">
        <div className="w-[100px] bg-white flex items-center justify-center">
          
            <Image
              src={data.profileImage}
              alt={data.firstName}
              className="max-h-16 object-contain"
            />
        </div>

        <h2 className="text-lg text-white font-semibold">
          {data.firstName} {data.lastName}
        </h2>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Personal Details
          </h3>
        </div>
        <div className="space-y-4">
          <DetailRow
            label="Full Name"
            value={
              <>
                {data.firstName} {data.lastName}
              </>
            }
          />
          <DetailRow label="Date of Birth" value={formatDate(data.dob)} />

          <DetailRow label="Email" value={data.email} />

          <DetailRow label="Phone No." value={data.phone} />

          <DetailRow label="Alternate Phone No." value={data.alternatePhone} />

          <DetailRow label="Blood Group" value={data.bloodGroup} />

          <DetailRow
            label="Marital Status"
            value={data.isMarried ? "Married" : "Single"}
          />

          <DetailRow
            label="Physically Disable"
            value={data.isPhysicallyDisabled ? "Yes" : "No"}
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Parents Details
          </h3>
        </div>

        <div className="space-y-4">
          <DetailRow
            label="Father Name"
            value={employeeDetails.parents.fatherName}
          />

          <DetailRow
            label="Father Phone No."
            value={employeeDetails.parents.fatherPhone}
          />

          <DetailRow
            label="Father Occupation"
            value={employeeDetails.parents.fatherOccupation}
          />

          <DetailRow
            label="Mother Name"
            value={employeeDetails.parents.motherName}
          />

          <DetailRow
            label="Mother Phone No."
            value={employeeDetails.parents.motherPhone}
          />

          <DetailRow
            label="Mother Occupation"
            value={employeeDetails.parents.motherOccupation}
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-md text-gray-600 font-semibold">
            Address Details
          </h3>
        </div>

        <div className="space-y-4">
          <DetailRow
            label="Current Address"
            value={data.address}
          />

          <DetailRow
            label="Permanent Address"
            value={data.permanentAddress}
          />
        </div>
      </div>
    </div>
  );
};



export default EmployeeDetailCard;
