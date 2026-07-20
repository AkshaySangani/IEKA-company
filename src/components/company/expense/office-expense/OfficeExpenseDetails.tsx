import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";

import { currency, pathNames } from "../../../../constants/constants";
import PageLoader from "../../../common/loader/PageLoader";

import { RoleEnum, statusEnum } from "../../../../types/common-types";
import Image from "../../../common/image";
import { getOfficeExpenseById } from "../../../../apis/expense/office-expense.api";
import { initialOfficeExpense, IOfficeExpense, IUser } from ".";
import PersonInfo from "../../../common/person-info";
import {
  DateFormat,
  formatDate,
  getDateDifference,
  getDateDifferenceBetween,
} from "../../../../utils/date-format";
import { getFileNameByUrl } from "../../../../utils/helper";

const OfficeExpenseDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { officeExpenseId } =
    (location.state as {
      officeExpenseId?: string;
    }) || {};

  const [loading, setLoading] = useState(false);

  const [officeExpenseDetails, setOfficeExpenseDetails] =
    useState<IOfficeExpense>(initialOfficeExpense);

  useEffect(() => {
    if (officeExpenseId) {
      fetchOfficeExpenseById(officeExpenseId);
    }
  }, [officeExpenseId]);

  // get reimbursement by id
  const fetchOfficeExpenseById = async (officeExpenseId: string) => {
    setLoading(true);
    const response = await getOfficeExpenseById(officeExpenseId);
    if (response.success) {
      const reimbursement = response.data;
      setOfficeExpenseDetails(reimbursement);
    }
    setLoading(false);
  };

  const handleClose = () => {
    navigate(pathNames.OFFICE_EXPENSE);
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

      <div className="content-area bg-secondary/5">
        <PageLoader loading={loading} />
        <div className="grid lg:grid-cols-2 gap-3">
          <div className="content-card p-4">
            <div className="grid grid-cols-[180px_1fr] gap-4">
              <div className="text-gray-500 text-sm">Expense Name</div>
              <div className="font-semibold text-gray-900 text-sm">
                {officeExpenseDetails.name}
              </div>

              <div className="text-gray-500 text-sm">Branch Name</div>
              <div className="font-semibold text-gray-900 text-sm">
                {officeExpenseDetails.branchId.name}
              </div>

              <div className="text-gray-500 text-sm">Gardian Person</div>
              <div>
                <PersonInfo
                  personInfo={{
                    profileImage: officeExpenseDetails.assignedBy.profileImage,
                    firstName: officeExpenseDetails.assignedBy.firstName,
                    lastName: officeExpenseDetails.assignedBy.lastName,
                    description: officeExpenseDetails.assignedBy.role,
                  }}
                />
              </div>

              <div className="text-gray-500 text-sm">Service Date</div>
              <div className="font-semibold text-gray-900 text-sm">
                {formatDate(officeExpenseDetails.date)}
              </div>

              <div className="text-gray-500 text-sm">Request Date</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {formatDate(officeExpenseDetails.createdAt)}
                </div>

                <div className="text-xs text-gray-400">
                  {formatDate(
                    officeExpenseDetails.createdAt,
                    DateFormat.TIME_24,
                  )}
                </div>
              </div>

              {officeExpenseDetails.description && (
                <>
                  <div className="text-gray-500 text-sm">Comment</div>

                  <div className="font-semibold text-gray-900 text-sm">
                    {officeExpenseDetails.description}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="content-card p-4">
            <div className="grid grid-cols-[180px_1fr] gap-4">
              <div className="text-gray-500 text-sm">Vendor Name</div>
              <div className="font-semibold text-gray-900 text-sm">
                {officeExpenseDetails.vendor.name}
              </div>

              <div className="text-gray-500 text-sm">Vendor Description</div>
              <div className="font-semibold text-gray-900 text-sm">
                {officeExpenseDetails.vendor.description}
              </div>

              <div className="text-gray-500 text-sm">
                Guarantee / Warranty ?
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {officeExpenseDetails.vendor.isOnWarranty ? "Yes" : "No"}
              </div>

              {!officeExpenseDetails.vendor.isOnWarranty &&
                officeExpenseDetails.vendor.startDate &&
                officeExpenseDetails.vendor.endDate && (
                  <>
                    <div className="text-gray-500 text-sm">Warranty Period</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {getDateDifferenceBetween(
                        officeExpenseDetails.vendor.startDate,
                        officeExpenseDetails.vendor.endDate,
                      )}
                    </div>
                  </>
                )}

              {officeExpenseDetails.vendor.startDate &&
                officeExpenseDetails.vendor.endDate && (<><div className="text-gray-500 text-sm">From To Date</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {formatDate(officeExpenseDetails.vendor.startDate)}{" - "}{formatDate(officeExpenseDetails.vendor.endDate)}
                </div>
              </div></>)}

              <div className="text-gray-500 text-sm">Purchase Mode</div>
              <div className="font-semibold text-gray-900 text-sm">
                  {officeExpenseDetails.paymentMode}
              </div>

              <div className="text-gray-500 text-sm">Transaction Id</div>
              <div className="font-semibold text-gray-900 text-sm">
                  {officeExpenseDetails.transactionId || "-"}
              </div>

              <div className="text-gray-500 text-sm">Purchase Cost</div>
              <div className="font-semibold text-gray-900 text-sm">
                  {currency.INR} {officeExpenseDetails.amount}
              </div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
          {officeExpenseDetails.documents?.length > 0 &&
            officeExpenseDetails.documents.map((file, index) => {
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

export default OfficeExpenseDetails;
