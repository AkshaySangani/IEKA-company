import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { initialTermination, ITermination } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { HistoryFieldEnum, statusEnum } from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/date-format";
import Badge from "../../../common/badge/Badge";
import MailSendModal from "../../../common/modal/MailSendModal";
import { sendTerminationMail } from "../../../../apis/workforce/termination.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import { HistoryPayload, initialHistory } from "../../../../apis/history/history.api";
import { useAuthStore } from "../../../../store/auth-store";

interface ITerminationListProps {
  terminations: ITermination[];
  handleEditTerminationDetails: (value: ITermination) => void;
  handleUpdateStatus: (value: ITermination) => void;
  refreshData: () => void;
}

export default function TerminationTable({
  terminations,
  handleEditTerminationDetails,
  handleUpdateStatus,
  refreshData,
}: ITerminationListProps) {
  const {user} = useAuthStore();
  const navigate = useNavigate();
  const [mailOpen, setMailOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // history states
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  const [terminationDetails, setTerminationDetails] =
    useState<ITermination>(initialTermination);
  // Define configuration structures with isolated column custom components
  const handleOnClick = (row: ITermination) => {
    handleEditTerminationDetails(row);
  };

  const handleSendMail = (row: ITermination) => {
    setMailOpen(true);
    setTerminationDetails(row);
  };

  const handleCloseMail = () => {
    setMailOpen(false);
    setTerminationDetails(initialTermination);
  };

  const columns: ColumnDef<ITermination>[] = [
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
      header: "Department",
      className: "w-[15%]",
      render: (row) => row.userId.departmentId.name,
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
        row.status !== statusEnum.CANCEL ? (
          <div className="flex items-center gap-1.5">
            <span className={`text-sm `}>{row?.mailSent ? "Yes" : "No"}</span>

            <i
              onClick={() => handleSendMail(row)}
              className="fa fa-envelope cursor-pointer text-gray-400 hover:text-gray-500"
            ></i>
            <InfoIcon onClick={() => handleShowHistory(row, HistoryFieldEnum.TerminationMail)} />
          </div>
        ) : (
          <>-</>
        ),
    },
    {
      header: "Letter",
      className: "w-[10%]",
      render: (row) =>
        row.status === statusEnum.TERMINATE ? (
          <Badge
            label="Terminate"
            onClick={() =>
              navigate(`${pathNames.TERMINATION_LETTER}/${row._id}`)
            }
          />
        ): (
          <>-</>
        ),
    },
    {
      header: "Status",
      className: "w-[12%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row, HistoryFieldEnum.TerminationStatus)} />
            {row.status !== statusEnum.CANCEL && (
              <i
                onClick={() => handleUpdateStatus(row)}
                className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
              ></i>
            )}
            <span
              className={`font-medium text-sm ${statusColor[row.status]}`}
            >
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
  const handleShowHistory = (termination: ITermination, field: HistoryFieldEnum) => {
    handleHistoryOpenClose();
    setHistory({
      field,
      fieldId: termination._id,
      title: `${termination.userId.firstName} ${termination.userId.lastName}`
    });
  };

  const handleSubmitMail = async () => {
    setLoading(true);
    const response = await sendTerminationMail({
      userId: terminationDetails?.userId?._id,
    });
    if (response?.success) {
      refreshData();
      handleCloseMail();
    }
    setLoading(false);
  };

  return (
    <>
      <CustomTable columns={columns} data={terminations} />
      <MailSendModal
        isOpen={mailOpen}
        title={"Are u sure want to send mail for this employee?"}
        showFullTitle
        profileImage={terminationDetails?.userId?.profileImage}
        loading={loading}
        handleOpenClose={handleCloseMail}
        handleSubmit={handleSubmitMail}
      >
        <div className="text-[13px] font-[400] text-inputLabel flex flex-col gap-2">
          <p>
            Dear{" "}
            <span id="interviewerNameGreeting">
              {terminationDetails?.userId?.firstName}{" "}
              {terminationDetails?.userId?.lastName}
            </span>
            ,
          </p>

          <p>
            We acknowledge receipt of your resignation and would like to inform
            you that the same has been accepted by the organization.
          </p>

          <p>
            We appreciate the contributions and efforts you have made during
            your tenure with us, and we thank you for your dedication and
            support.
          </p>

          <p>
            As you move forward, we wish you the very best in your future
            endeavors and continued success in all your professional pursuits.
          </p>

          <p>
            Should you require any assistance during the transition period,
            please feel free to reach out to the HR team.
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
        isMailHistory={history.field === HistoryFieldEnum.TerminationMail}
      />
    </>
  );
}
