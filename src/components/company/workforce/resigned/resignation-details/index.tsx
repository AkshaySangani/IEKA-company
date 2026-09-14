import React, { useEffect, useState } from "react";
import { statusEnum } from "../../../../../types/common-types";
import TopBar from "../../../../common/topbar/TopBar";
import Button from "../../../../common/button/Button";
import EmptyPlaceholder from "../../../../common/empty-paceholder";
import ActionModal from "../../../../common/modal/ActionModal";
import ApplyResignation from "../apply-resignation";
import { useAuthStore } from "../../../../../store/auth-store";
import {
  getResignationByEmployeeId,
  updateResignedEmployeeStatus,
} from "../../../../../apis/workforce/resigned.api";
import { ResignationRequest } from "..";
import { DateFormat, formatDate } from "../../../../../utils/date-format";
import StatusBadge from "../../../../common/badge/StatusBadge";
import PersonInfo from "../../../../common/person-info";

const ResignationDetails: React.FC = () => {
  const { user } = useAuthStore();
  // loading state
  const [loading, setLoading] = useState<boolean>(false);

  const [show, setShow] = useState<boolean>(false);
  const [resignationId, setResignationId] = useState<string>("");

  // cancel request states
  const [actionOpen, setActionOpen] = useState<boolean>(false);

  const [resignation, setResignation] = useState<ResignationRequest | null>(
    null,
  );

  useEffect(() => {
    if (user._id) {
      fetchResignationRequest();
    }
    // eslint-disable-next-line
  }, [user._id]);

  const fetchResignationRequest = async () => {
    setLoading(true);
    const response = await getResignationByEmployeeId(user._id);
    if (response.success) {
      setResignation(response.data);
    } else {
      setResignation(null);
    }
    setLoading(false);
  };

  const handleStatusSubmit = async () => {
    setLoading(true);

    const payload = {
      status: statusEnum.CANCELED,
      remarks: "Canceled",
    };

    const response = await updateResignedEmployeeStatus(
      payload,
      resignation?._id,
    );
    if (response.success) {
      fetchResignationRequest();
    }
    setLoading(false);
  };

  const handleAction = () => {
    setActionOpen((prev) => !prev);
  };

  // handle Apply resignation open close
  const handleOpenClose = (resignationId?: string) => {
    setShow((prev) => !prev);
    if (resignationId) {
      setResignationId(resignationId);
    } else {
      setResignationId("");
    }
  };

  return (
    <>
      <TopBar
        title="Resignation Request"
        actionButtons={
          <div className="flex flex-row gap-2">
            {resignation?.status === statusEnum.PENDING && (
              <Button
                name="Cancel Request"
                size="sm"
                variant="danger"
                onClick={handleAction}
              />
            )}
            {resignation?.status !== statusEnum.ACCEPTED && (
              <Button
                name="Add New"
                size="sm"
                onClick={() => handleOpenClose(user._id)}
                leftIcon={<i className="fa-solid fa-plus"></i>}
              />
            )}
          </div>
        }
      />
      <div className="content-area">
        {resignation ? (
          <>
            {/* Employee Information */}
            <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-y-5">
              {/* Name */}
              <div className="text-md font-normal text-grayText">Name</div>

              <PersonInfo
                personInfo={{
                  profileImage: resignation.userId.profileImage,
                  firstName: resignation.userId.firstName,
                  lastName: resignation.userId.lastName,
                  description: resignation.userId.userId,
                }}
                personClassName="text-secondary !text-md"
                imageClassName="!h-14 !w-14"
              />

              {/* Role */}
              <div className="text-md font-normal text-grayText">Role</div>

              <div className="text-md font-semibold text-secondary">
                {resignation.userId.designationId?.name}
              </div>

              {/* Branch */}
              <div className="text-md font-normal text-grayText">Branch</div>

              <div>
                <span className="inline-flex bg-[#f3f4f6] px-3 py-1.5 text-md font-medium text-grayText">
                  {resignation.userId.branchId?.name}
                </span>
              </div>

              {/* Shift */}
              <div className="text-md font-normal text-grayText">Shift</div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-md font-semibold text-primary">
                    {resignation.userId.shiftId?.name}
                  </span>
                </div>

                <span className="mt-1 text-sm text-grayText">
                  Time : ({resignation.userId.shiftId?.startTime} to{" "}
                  {resignation.userId.shiftId?.endTime})
                </span>
              </div>

              {/* Department */}
              <div className="text-md font-normal text-grayText">
                Department
              </div>

              <div>
                <span className="inline-flex bg-[#eef3ff] px-3 py-1.5 text-md font-medium text-grayText">
                  {resignation.userId.departmentId?.name}
                </span>
              </div>

              {/* Joining Date */}
              <div className="text-md font-normal text-grayText">
                Joining Date
              </div>

              <div className="text-md font-semibold text-secondary">
                {formatDate(resignation.createdAt)}
              </div>
            </div>

            {/* Separator */}
            <div className="my-6 border-t border-gray-300" />

            {/* Resignation Information */}
            <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-y-5">
              {/* Reason */}
              <div className="text-md font-normal text-grayText">
                Reason for Leaving
              </div>

              <div className="text-md font-semibold text-secondary text-wrap truncate line-clamp-2 sm:line-clamp-4 max-w-[200px] sm:max-w-[400px]">
                {resignation.reason}
              </div>

              {/* Apply Date */}
              <div className="text-md font-normal text-grayText">
                Resignation Apply Date
              </div>

              <div className="flex items-center gap-3">
                <span className="text-md font-semibold text-secondary">
                  {formatDate(resignation.createdAt)}
                </span>

                <span className="text-md text-grayText">
                  {formatDate(resignation.createdAt, DateFormat.TIME_24)}
                </span>
              </div>

              {/* Last Working Date */}
              {resignation.status === statusEnum.ACCEPTED &&
                resignation.lastWorkingDate && (
                  <>
                    <div className="text-md font-normal text-grayText">
                      Resignation Apply Date
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-md font-semibold text-secondary">
                        {formatDate(resignation.lastWorkingDate)}
                      </span>
                    </div>
                  </>
                )}

              {/* Approval Status */}
              <div className="text-md font-normal text-grayText">
                Approval Status
              </div>

              <div className="flex items-center gap-1.5">
                <StatusBadge status={resignation.status} />
              </div>
            </div>
          </>
        ) : (
          <EmptyPlaceholder
            title="No resignation found."
            description="It seems there is no resignation request found. you can add new request."
          />
        )}
      </div>
      <ActionModal
        isOpen={actionOpen}
        title={`Are you sure you want to cancel resignation request ?`}
        loading={loading}
        handleOpenClose={handleAction}
        handleSubmit={handleStatusSubmit}
      />
      <ApplyResignation
        show={show}
        handleOpenClose={handleOpenClose}
        resignationId={resignationId}
        refreshData={() => fetchResignationRequest()}
      />
    </>
  );
};

export default ResignationDetails;
