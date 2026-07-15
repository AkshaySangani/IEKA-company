import React, { useState } from "react";
import Image from "../../common/image";
import Modal from "../../common/modal/Modal";
import { moduleEnum, statusMessage, statusOptions } from "../../../constants/constants";
import RadioButton from "../../common/radio-button";
import TextAreaField from "../../common/text-area/TextAreaField";
import Note from "../../common/note-area/Note";
import { ICompanyRepresentative } from ".";
import Info from "../../../assets/icons/Info";
import EmployeeManagementIcon from "../../../assets/images/employee_management.png";
import ProductionManagementIcon from "../../../assets/images/production.png"
import UserAvatar from "../../../assets/images/User-Image.jpg";
import { ObjectType, statusEnum } from "../../../types/common-types";

export const modules: ObjectType = {
  [moduleEnum.EMPLOYEE]: {
    imageUrl: EmployeeManagementIcon,
    name: "Employee Management"
  },
  [moduleEnum.PRODUCTION]:{
    imageUrl: ProductionManagementIcon,
    name: "Production Management"
  }
}

interface IStatusFormData {
    status: statusEnum;
    remarks: string;
}

interface Props {
  data: ICompanyRepresentative;
  moduleAccess: string[];
  handleOwnerOpen: () => void;
}

const OwnerDetailCard: React.FC<Props> = ({ data, moduleAccess, handleOwnerOpen }) => {
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isMailOpen, setIsMailOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<IStatusFormData>({
    status: statusEnum.ACTIVE,
    remarks: ""
  });

  // handle open close status modal
  const handleOpenCloseStatus = () => {
    setIsStatusOpen((prev) => !prev);
  };

  // handle open close mail modal
  const handleOpenCloseMail = () => {
    setIsMailOpen((prev) => !prev);
  };

  // handle change status 
  const handleStatusChange = (name: string, value: any) => {
    setFormData(prev => ({...prev, [name]: value}));
  }
  return (
    <>
      <div className="content-card bg-white border border-gray-200 p-5">
        <div className="flex items-center justify-between border-b-2 pb-2 mb-2">
          <h3 className="text-md text-gray-600 font-semibold">
            {data.firstName}{" "}{data.lastName}
          </h3>

          <button onClick={handleOwnerOpen}>
            <i className="fa-solid fa-pen-to-square text-gray-500 text-lg" />
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center py-[10px] bg-gray-200">
            <Image
              src={data.profileImage}
              width="80"
              alt={data.firstName}
              fallbackSrc={UserAvatar}
              // className="h-28 w-28 object-contain"
            />
        </div>

        <div className="mt-4 space-y-4">
          {/* <Row label="Owner Id." value={data.ownerId} /> */}

          <Row label="Person Name" value={`${data.firstName} ${data.lastName}`} />

          <Row
            label="Status"
            value={
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">
                  {statusMessage[data.status]}
                </span>
                <button 
                    // onClick={handleOpenCloseStatus}
                >
                  <i className="fa-solid fa-pen-to-square text-gray-400 text-sm hover:text-gray-500" />
                </button>
                {/* <button onClick={handleOpenCloseStatus}>
                  <Info/>
                </button> */}
              </div>
            }
          />

          <Row
            label="Modules Access & Price"
            value={
              <div className="flex flex-col gap-2">
                {moduleAccess.map((module) => (
                  <div
                    key={module}
                    className="bg-primary text-white px-2 py-1 rounded-md flex items-center gap-2"
                  >
                    <div className="p-1 bg-white rounded-md"><Image src={modules[module].imageUrl} width={30}/></div>
                    {modules[module].name}
                  </div>
                ))}
              </div>
            }
          />

          <Row
            label="Email Sent"
            value={
              <div className="flex items-center gap-2">
                {"No"}
                {/* <button onClick={handleOpenCloseMail}>
                  <i className="fa-solid fa-envelope text-gray-400 text-sm hover:text-gray-500" />
                </button> */}
              </div>
            }
          />

          <Row label="Person Email" value={data.email} />

          <Row label="Phone No." value={data.phone} />
        </div>
      </div>
      <Modal
        isOpen={isStatusOpen}
        width="max-w-xl"
        title={""}
        onClose={handleOpenCloseStatus}
        handleOnConfirm={function (value?: any): void {
          throw new Error("Function not implemented.");
        }}
      >
        <div className="flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <Image src={data.profileImage} width={80} />
            <div className="text-lg font-semibold">
              Are u sure want to change status of this person ?
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="status"
              label="Status"
              required
              value={data.status}
              options={statusOptions}
              onChange={function (value: string): void {
                throw new Error("Function not implemented.");
              }}
            />
            <TextAreaField
              required
              label="Remarks"
              name={"remarks"}
              value={""}
              placeholder="Enter remarks..."
            />
            <Note
              variant="danger"
              message={
                "After inactive or delete this person & their employee can not accessible portal."
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMailOpen}
        // width="max-w-xl"
        title={""}
        onClose={handleOpenCloseMail}
        handleOnConfirm={function (value?: any): void {
          throw new Error("Function not implemented.");
        }}
      >
        <div className="flex flex-col">
          <div className="flex flex-col justify-center items-center border-b-2">
            <Image src={""} width={80} />
            <div className="text-lg font-semibold">
              Are u sure want to send mail for this person ?
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs leading-6 text-gray-600 mb-4">
              <p className="">
                Dear <span className="font-medium">Harsh Kanakhara</span>,
              </p>

              <p className="">
                We are pleased to welcome you to{" "}
                <span className="font-semibold text-gray-700">
                  Ieka Digital
                </span>
                . We are excited to have you onboard and look forward to
                supporting you.
              </p>

              <p className="">
                Please find below your access details for our platform, where
                you can manage everything related to your account:
              </p>

              <div className="space-y-3">
                <p>
                  Portal URL:{" "}
                  <span className="font-semibold text-gray-700">
                    [Portal Link]
                  </span>
                </p>

                <p>
                  User ID:{" "}
                  <span className="font-semibold text-gray-700">
                    [Your User ID]
                  </span>
                </p>

                <p>
                  Password:{" "}
                  <span className="font-semibold text-gray-700">
                    [Your Temporary Password]
                  </span>
                </p>
              </div>

              <p className="">
                You can also access our platform on the go by downloading our
                mobile app:
              </p>

              <div className="space-y-3">
                <p>
                  Android:{" "}
                  <span className="font-semibold text-gray-700">
                    [Google Play Store Link]
                  </span>
                </p>

                <p>
                  iOS:{" "}
                  <span className="font-semibold text-gray-700">
                    [Apple App Store Link]
                  </span>
                </p>
              </div>

              <p className="">
                For security reasons, we strongly recommend that you change your
                password after your first login. Please ensure that you do not
                share your login credentials with anyone.
              </p>

              <p className="">
                If you face any issues while accessing the portal or the app, or
                have any questions, feel free to reach out to our support team
                for assistance.
              </p>

              <p className="">
                Once again, welcome aboard. We wish you a successful and
                fulfilling journey with us.
              </p>

              <div className="mt-8">
                <p className="">Regards,</p>

                <p className="font-semibold text-gray-700">Sunny Sangani</p>

                <p className="mt-2">Ieka Digital</p>
              </div>
            </div>
            <TextAreaField
              required
              label="Remarks"
              name={"remarks"}
              value={""}
              placeholder="Enter remarks..."
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-sm justify-between gap-5 border-b border-gray-200 pb-3">
    <div className="text-gray-700">{label}</div>

    <div className="font-normal text-right">{value}</div>
  </div>
);

export default OwnerDetailCard;
