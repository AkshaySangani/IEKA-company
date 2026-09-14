import { ColumnDef, CustomTable } from "../../../common/table";
import { pathNames, roleNames } from "../../../../constants/constants";
import { initialEmployee, ResignationRequest } from ".";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import {
  HistoryFieldEnum,
  RoleEnum,
  statusEnum,
} from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Badge from "../../../common/badge/Badge";
import MailSendModal from "../../../common/modal/MailSendModal";
import { sendResignMail, updateResignedEmployeeStatus } from "../../../../apis/workforce/resigned.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { useAuthStore } from "../../../../store/auth-store";
import Description from "../../../common/description";
import StatusCell from "../../../common/status-cell";
import MailStatusCell from "../../../common/mail-status-cell";
import ActionModal from "../../../common/modal/ActionModal";

interface ResignationRequestListProps {
  resignedEmployees: ResignationRequest[];
  handleUpdateStatus: (
    value: ResignationRequest,
    type: "status" | "update",
  ) => void;
  refreshData: () => void;
}

export default function ResignedEmployeeTable({
  resignedEmployees,
  handleUpdateStatus,
  refreshData,
}: ResignationRequestListProps) {
  const { user } = useAuthStore();
  const isEmployee = user?.role === RoleEnum.EMPLOYEE;
  const navigate = useNavigate();
  const [mailOpen, setMailOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [show, setShow] = useState<boolean>(false);
  const [resignationId, setResignationId] = useState<string>("");

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const [resignDetails, setResignDetails] =
    useState<ResignationRequest>(initialEmployee);

  const handleSendMail = (row: ResignationRequest) => {
    setMailOpen(true);
    setResignDetails(row);
  };

  const handleCloseMail = () => {
    setMailOpen(false);
    setResignDetails(initialEmployee);
  };

  const handleStatusSubmit = async () => {
        setLoading(true);
    
        const payload = {
          status: statusEnum.CANCELED,
          remarks: "Canceled",
        };
    
        const response = await updateResignedEmployeeStatus(
          payload,
          resignationId,
        );
        if (response.success) {
          refreshData();
        }
        setLoading(false);
      };
  
    // handle Cancel resignation open close
    const handleOpenClose = (resignation?: ResignationRequest | null) => {
      setShow((prev) => !prev);
      if (resignation) {
        setResignationId(resignation._id);
      } else {
        setResignationId("");
      }
    };

  const columns: ColumnDef<ResignationRequest>[] = [
    {
      header: "#",
      className: "",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row?.userId?.profileImage,
            firstName: row?.userId?.firstName,
            lastName: row?.userId?.lastName,
            description: `${row.userId?.userId} | ${roleNames[row?.userId?.role]}`,
          }}
        />
      ),
    },
    {
      header: "Resign Date",
      className: "",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.createdAt)}
          <span className="text-grayText text-xs">
            {formatDate(row.createdAt, DateFormat.TIME_24)}
          </span>
        </div>
      ),
    },
    {
      header: "Reason",
      className: "",
      render: (row) => (row.reason ? <Description value={row.reason} /> : "-"),
    },
    {
      header: "Last Working Day",
      className: "",
      render: (row) => formatDate(row.lastWorkingDate),
    },
    {
      header: "Info Mail",
      className: "",
      render: (row) => {
        const isManager =
          row?.userId._id === user._id && user.role === RoleEnum.MANAGER;
        return (
          <>
            {!isManager && row.status !== statusEnum.PENDING ? (
              <MailStatusCell
                mailSent={row?.mailSent}
                onSendMail={() => handleSendMail(row)}
                onHistory={() =>
                  handleShowHistory(row, HistoryFieldEnum.ResignationMail)
                }
              />
            ) : "-"}
          </>
        );
      },
    },
    {
      header: "Certificate",
      className: "",
      render: (row) => {
        const isManager =
          row?.userId._id === user._id && user.role === RoleEnum.MANAGER;
        return row.status === statusEnum.ACCEPTED && !isManager ? (
          <div className="flex gap-2">
            <Badge
              label="Relieving"
              onClick={() =>
                navigate(`${pathNames.RELIEVING_LETTER}/${row.userId?._id}`)
              }
            />
            <Badge
              label="Experience"
              onClick={() =>
                navigate(`${pathNames.EXPERIENCE_LETTER}/${row.userId?._id}`)
              }
            />
            <Badge
              label="F & F"
              onClick={() => navigate(`${pathNames.FNF_LETTER}/${row.userId?._id}`)}
            />
          </div>
        ) : "-"}
    },
    {
      header: "Status",
      className: "",
      render: (row) => {
        const isManager =
          row?.userId._id === user._id && user.role === RoleEnum.MANAGER;
        return (
          <StatusCell
            status={row.status}
            isEditable={row.status !== statusEnum.ACCEPTED}
            onEdit={() => isManager ? handleOpenClose() : handleUpdateStatus(row, "status")}
            onHistory={() =>
              handleShowHistory(row, HistoryFieldEnum.ResignationStatus)
            }
          />
        );
      },
    },
  ];

  const employeeColumns: ColumnDef<ResignationRequest>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Resign Date",
      className: "",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {formatDate(row.createdAt)}
          <span className="text-grayText text-xs">
            {formatDate(row.createdAt, DateFormat.TIME_24)}
          </span>
        </div>
      ),
    },
    {
      header: "Reason",
      className: "",
      render: (row) => (row.reason ? <Description value={row.reason} /> : "-"),
    },
    {
      header: "Last Working Day",
      className: "",
      render: (row) => formatDate(row.lastWorkingDate),
    },
    {
      header: "Status",
      className: "",
      render: (row) => {
        return (
          <StatusCell
            status={row.status}
            isEditable={row.status === statusEnum.PENDING && isEmployee}
            onEdit={() => handleUpdateStatus(row, "update")}
            onHistory={() =>
              handleShowHistory(row, HistoryFieldEnum.ResignationStatus)
            }
          />
        );
      },
    },
  ];

  // handle history open
  const handleHistoryOpenClose = () => {
    setHistoryOpen((prev) => !prev);
    setHistory(initialHistory);
  };

  // handle show history
  const handleShowHistory = (
    employee: ResignationRequest,
    field: HistoryFieldEnum,
  ) => {
    handleHistoryOpenClose();
    setHistory({
      field,
      fieldId: employee._id,
      title: `${employee.userId.firstName} ${employee.userId.lastName} | ${employee.userId?.userId}`,
    });
  };

  const handleSubmitMail = async () => {
    setLoading(true);
    const response = await sendResignMail({
      userId: resignDetails?.userId?._id,
    });
    if (response?.success) {
      refreshData();
      handleCloseMail();
    }
    setLoading(false);
  };

  return (
    <>
      <CustomTable
        columns={isEmployee ? employeeColumns : columns}
        data={resignedEmployees}
      />
      <MailSendModal
        isOpen={mailOpen}
        title={"Are u sure want to send mail for this employee?"}
        showFullTitle
        profileImage={resignDetails?.userId?.profileImage}
        loading={loading}
        handleOpenClose={handleCloseMail}
        handleSubmit={handleSubmitMail}
      >
        <div className="text-[13px] font-[400] text-inputLabel flex flex-col gap-2">
          <p>
            Dear{" "}
            <span id="interviewerNameGreeting">
              {resignDetails?.userId?.firstName}{" "}
              {resignDetails?.userId?.lastName}
            </span>
            ,
          </p>

          <p>
            This is to formally inform you that your resignation has been
            reviewed and accepted by the organization.
          </p>

          <p>
            Your last working day is approx{" "}
            <span>{formatDate(resignDetails.lastWorkingDate)}</span> or also
            discussed and mutually agreed upon.
          </p>

          <p>
            We sincerely appreciate your valuable contributions and the
            dedication you have shown during your time with us.
          </p>

          <p>
            We wish you continued growth, success, and the very best in your
            future professional journey.
          </p>

          <p>
            Please coordinate with the HR team to complete the necessary exit
            formalities and handover process.
          </p>

          <p>Regards,</p>
          <p>
            <strong>
              <span id="actionbyname">
                {user.firstName} {user.lastName}
              </span>
            </strong>
          </p>
          <p>{"(COO)"}</p>
        </div>
      </MailSendModal>
      <HistoryModal
        isOpen={historyOpen}
        handleOpenClose={handleHistoryOpenClose}
        history={history}
        isMailHistory={history.field === HistoryFieldEnum.ResignationMail}
      />

      <ActionModal
        isOpen={show}
        title={`Are you sure you want to cancel resignation request ?`}
        loading={loading}
        handleOpenClose={handleOpenClose}
        handleSubmit={handleStatusSubmit}
      />
    </>
  );
}
