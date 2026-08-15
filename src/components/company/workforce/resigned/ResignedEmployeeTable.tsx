import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { initialEmployee, ResignationRequest } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { HistoryFieldEnum, statusEnum } from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Badge from "../../../common/badge/Badge";
import MailSendModal from "../../../common/modal/MailSendModal";
import { sendResignMail } from "../../../../apis/workforce/resigned.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { useAuthStore } from "../../../../store/auth-store";

interface ResignationRequestListProps {
  resignedEmployees: ResignationRequest[];
  handleUpdateStatus: (value: ResignationRequest) => void;
  refreshData: () => void;
}

export default function ResignedEmployeeTable({
  resignedEmployees,
  handleUpdateStatus,
  refreshData,
}: ResignationRequestListProps) {
  const {user} = useAuthStore();
  const navigate = useNavigate();
  const [mailOpen, setMailOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const [resignDetails, setResignDetails] =
    useState<ResignationRequest>(initialEmployee);

  // Define configuration structures with isolated column custom components
  const handleOnClick = (row: ResignationRequest) => {
    navigate(pathNames.EMPLOYEE_DETAILS, {
      state: {
        employeeId: row?.userId?._id,
      },
    });
  };

  const handleSendMail = (row: ResignationRequest) => {
    setMailOpen(true);
    setResignDetails(row);
  };

  const handleCloseMail = () => {
    setMailOpen(false);
    setResignDetails(initialEmployee);
  };

  const columns: ColumnDef<ResignationRequest>[] = [
    {
      header: "#",
      className: "w-[3%] text-center text-gray-500",
      render: (_, index) => index + 1,
    },
    {
      header: "Employee Name",
      className: "w-[20%]",
      render: (row) => (
        <PersonInfo
          personInfo={{
            profileImage: row?.userId?.profileImage,
            firstName: row?.userId?.firstName,
            lastName: row?.userId?.lastName,
            description: roleNames[row?.userId?.role],
          }}
          onClick={() => handleOnClick(row)}
        />
      ),
    },
    {
      header: "Resign Date",
      className: "w-[15%]",
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
      className: "w-[15%]",
      render: (row) => (row.reason ? row.reason : "-"),
    },
    {
      header: "Last Working Day",
      className: "w-[15%]",
      render: (row) => formatDate(row.lastWorkingDate),
    },
    {
      header: "Info Mail",
      className: "w-[10%]",
      render: (row) =>
        row.status !== statusEnum.PENDING ? (
          <div className="flex items-center gap-1.5">
            <span className={`text-sm `}>{row?.mailSent ? "Yes" : "No"}</span>

            <i
              onClick={() => handleSendMail(row)}
              className="fa fa-envelope cursor-pointer text-gray-400 hover:text-gray-500"
            ></i>
            <InfoIcon
              onClick={() =>
                handleShowHistory(row, HistoryFieldEnum.ResignationMail)
              }
            />
          </div>
        ) : (
          <>-</>
        ),
    },
    {
      header: "Certificate",
      className: "w-[20%]",
      render: (row) =>
        row.status === statusEnum.ACCEPTED && (
          <div className="flex gap-2">
            <Badge
              label="Relieving"
              onClick={() =>
                navigate(`${pathNames.RELIEVING_LETTER}/${row._id}`)
              }
            />
            <Badge
              label="Experience"
              onClick={() =>
                navigate(`${pathNames.EXPERIENCE_LETTER}/${row._id}`)
              }
            />
            <Badge
              label="F & F"
              onClick={() => navigate(`${pathNames.FNF_LETTER}/${row._id}`)}
            />
          </div>
        ),
    },
    {
      header: "Status",
      className: "w-[12%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon
              onClick={() =>
                handleShowHistory(row, HistoryFieldEnum.ResignationStatus)
              }
            />
            {row.status !== statusEnum.REJECTED && (
              <i
                onClick={() => handleUpdateStatus(row)}
                className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
              ></i>
            )}
            <span className={`font-medium text-sm ${statusColor[row.status]}`}>
              {statusMessage[row.status]}
            </span>
          </div>
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
      title: `${employee.userId.firstName} ${employee.userId.lastName}`,
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
      <CustomTable columns={columns} data={resignedEmployees} />
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
              <span id="actionbyname">{user.firstName}{" "}{user.lastName}</span>
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
    </>
  );
}
