import { format } from "date-fns";
import { ILeaveRequest, initialLeaveRequest } from ".";
import {
  LeaveDuration,
  LeaveDurationNames,
  statusEnum,
} from "../../../../types/common-types";
import { getLeaveRequestById } from "../../../../apis/performance/leave-request.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import PersonInfo from "../../../common/person-info";
import {
  pathNames,
  roleNames,
  statusMessage,
} from "../../../../constants/constants";
import TopBar from "../../../common/topbar/TopBar";
import Button from "../../../common/button/Button";
import EmptyPlaceholder from "../../../common/empty-paceholder";
import PageLoader from "../../../common/loader/PageLoader";
import Badge from "../../../common/badge/Badge";
import StatusBadge from "../../../common/badge/StatusBadge";

const LeaveRequestDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const leaveId =
    (
      params as {
        id?: string;
      }
    ).id || "";

  const [loading, setLoading] = useState<boolean>(true);

  const [leaveDetails, setLeaveDetails] =
    useState<ILeaveRequest>(initialLeaveRequest);

  useEffect(() => {
    if (leaveId) {
      fetchLeaveRequestById(leaveId);
    }
  }, [leaveId]);

  /* ------------------------------------------------------------------------ */
  /*                         FETCH EXISTING REQUEST                            */
  /* ------------------------------------------------------------------------ */

  const fetchLeaveRequestById = async (id: string) => {
    try {
      setLoading(true);

      /**
       * fetch employee leave request.
       */

      const response = await getLeaveRequestById(id);

      if (response?.success && response?.data) {
        setLeaveDetails(response.data);
      } else {
        setLeaveDetails(initialLeaveRequest);
      }
    } catch (error) {
      console.error("Failed to fetch leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: statusEnum) => {
    switch (status) {
      case statusEnum.APPROVED:
        return "bg-green-50 text-green-700 ring-green-600/20";

      case statusEnum.PENDING:
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";

      case statusEnum.REJECTED:
        return "bg-red-50 text-red-700 ring-red-600/20";

      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <>
      <TopBar
        title="Employee Leave Request"
        actionButtons={
          <Button
            size="sm"
            variant="danger"
            onClick={() => navigate(pathNames.LEAVE_REQUEST)}
            leftIcon={<i className="fa-solid fa-xmark fa-xl text-danger" />}
          />
        }
      />

      <div className="content-area bg-dashboardBg">
        {loading ? (
          <PageLoader loading={loading} />
        ) : leaveDetails?._id ? (
          <div className="content-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <PersonInfo
                personInfo={{
                  profileImage: leaveDetails.userId.profileImage,
                  firstName: leaveDetails.userId.firstName,
                  lastName: leaveDetails.userId.lastName,
                  description: roleNames[leaveDetails.userId.role],
                }}
                personClassName="text-secondary"
              />

              {/* Status */}
              <StatusBadge status={leaveDetails.status} />
            </div>

            {/* Leave Details */}
            <div className="grid grid-cols-2 gap-4 px-5 py-5 sm:grid-cols-4">
              {/* Leave Type */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Leave Type
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {leaveDetails.leaveId}
                </p>
              </div>

              {/* Duration */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Duration
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {LeaveDurationNames[leaveDetails.duration]}
                </p>
              </div>

              {/* Total Days */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Total Days
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {leaveDetails.totalDays}
                </p>
              </div>

              {/* Applied Date */}
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Applied On
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {formatDate(leaveDetails.createdAt)}
                </p>
              </div>
            </div>

            {/* Date Range */}
            <div className="mx-5 rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    From
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatDate(leaveDetails.startDate)}
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <div className="flex w-full items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200" />

                    <i className="fa-solid fa-arrow-right text-xs text-gray-400" />

                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    To
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatDate(leaveDetails.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="px-5 py-4">
              <p className="mb-1 text-xs font-medium text-gray-400">Reason</p>

              <p className="text-sm leading-5 text-gray-600">
                {leaveDetails.reason || "No reason provided"}
              </p>
            </div>

            {/* Approval Details */}
            {leaveDetails.status === statusEnum.APPROVED &&
              leaveDetails.approvedAt && (
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
                      <i className="fa-solid fa-check text-xs text-green-600" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        Approved
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {formatDate(
                          leaveDetails.approvedAt,
                          DateFormat.FULL_DATE_TIME,
                        )}
                      </p>
                    </div>
                  </div>

                  {leaveDetails.remarks && (
                    <p className="max-w-[50%] text-right text-xs text-gray-500">
                      {leaveDetails.remarks}
                    </p>
                  )}
                </div>
              )}
          </div>
        ) : (
          <EmptyPlaceholder
            title="Leave request not found."
            description="It seems there is not any leave request for this employee. please check back later."
          />
        )}
      </div>
    </>
  );
};

export default LeaveRequestDetails;
