import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";

import {
  currency,
  pathNames,
} from "../../../../constants/constants";
import PageLoader from "../../../common/loader/PageLoader";

import {
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import Image from "../../../common/image";
import {
  getReimbursementById,
} from "../../../../apis/expense/reimbursement.api";
import { IUser } from ".";
import PersonInfo from "../../../common/person-info";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import { getFileNameByUrl } from "../../../../utils/helper";

export interface IReimbursement {
  _id: string;
  companyId: string;
  branchId: IReimbursementBranch;
  userId: IUser;
  name: string;
  date: string;
  description: string;
  amount: number;
  status: statusEnum;
  documents: string[];
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReimbursementBranch {
  _id: string;
  name: string;
}

const ReimbursementDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { reimbursementId } =
    (location.state as {
      reimbursementId?: string;
    }) || {};

  const initialReimbursement: IReimbursement = {
    _id: "",
    companyId: "",
    branchId: {
      _id: "",
      name: "",
    },
    userId: {
      _id: "",
      firstName: "",
      lastName: "",
      profileImage: "",
      role: RoleEnum.EMPLOYEE,
    },
    name: "",
    date: "",
    description: "",
    amount: 0,
    status: statusEnum.APPROVED,
    documents: [],
    assignedBy: "",
    createdAt: "",
    updatedAt: "",
  };

  const [loading, setLoading] = useState(false);

  const [reimbursementDetails, setReimbursementDetails] =
    useState<IReimbursement>(initialReimbursement);

  useEffect(() => {
    if (reimbursementId) {
      fetchReimbursementById(reimbursementId);
    }
  }, [reimbursementId]);

  // get reimbursement by id
  const fetchReimbursementById = async (reimbursementId: string) => {
    setLoading(true);
    const response = await getReimbursementById(reimbursementId);
    if (response.success) {
      const reimbursement = response.data;
      setReimbursementDetails(reimbursement);
    }
    setLoading(false);
  };

  const handleClose = () => {
    navigate(pathNames.REIMBURSEMENT);
  };

  return (
    <>
      <TopBar
        title="Work Expense"
        actionButtons={
          <Button
            size="sm"
            variant={"danger"}
            onClick={handleClose}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger"></i>}
          />
        }
      />

      <div className="content-area">
        <PageLoader loading={loading} />
          <div className="grid grid-cols-[180px_1fr] gap-4">
            <div className="text-gray-500 text-sm">Expense Name</div>
            <div className="font-semibold text-gray-900 text-sm">
              {reimbursementDetails.name}
            </div>

            <div className="text-gray-500 text-sm">Branch Name</div>
            <div className="font-semibold text-gray-900 text-sm">
              {reimbursementDetails.branchId.name}
            </div>

            <div className="text-gray-500 text-sm">Employee Name</div>
            <div>
              <PersonInfo
                personInfo={{
                  profileImage: reimbursementDetails.userId.profileImage,
                  firstName: reimbursementDetails.userId.firstName,
                  lastName: reimbursementDetails.userId.lastName,
                  description: reimbursementDetails.userId.role,
                }}
              />
            </div>

            <div className="text-gray-500 text-sm">Expense Date</div>
            <div className="font-semibold text-gray-900 text-sm">
              {formatDate(reimbursementDetails.date)}
            </div>

            <div className="text-gray-500 text-sm">Request Date</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">
                {formatDate(reimbursementDetails.createdAt)}
              </div>

              <div className="text-xs text-gray-400">
                {formatDate(
                  reimbursementDetails.createdAt,
                  DateFormat.TIME_24,
                )}
              </div>
            </div>

            <div className="text-gray-500 text-sm">Amount</div>
            <div>
              <span className="inline-flex items-center rounded-full bg-indigo-500 px-5 py-2 text-white font-semibold">
                {currency.INR} {reimbursementDetails.amount}
              </span>
            </div>

            {reimbursementDetails.description && (
              <>
                <div className="text-gray-500 text-sm">Comment</div>

                <div className="font-semibold text-gray-900 text-sm">
                  {reimbursementDetails.description}
                </div>
              </>
            )}
          </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-3">
          {reimbursementDetails.documents?.length > 0 &&
            reimbursementDetails.documents.map((file, index) => {
              const fileName = getFileNameByUrl(file);
              return (
                <div
                  key={index}
                  className="content-card flex flex-col justify-between gap-1 p-2"
                >
                  <Image src={file} height={300} alt={fileName} />
                  <span>{fileName}</span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ReimbursementDetails;
