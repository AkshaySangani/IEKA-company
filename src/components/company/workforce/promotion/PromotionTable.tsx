import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
} from "../../../../constants/constants";
import { initialPromotion, IPromotion } from ".";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { HistoryFieldEnum, RoleEnum, statusEnum } from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Badge from "../../../common/badge/Badge";
import MailSendModal from "../../../common/modal/MailSendModal";
import { sendPromotionMail } from "../../../../apis/workforce/promotion.api";
import HistoryModal from "../../../common/modal/HistoryModal";
import {
  HistoryPayload,
  initialHistory,
} from "../../../../apis/history/history.api";
import { useAuthStore } from "../../../../store/auth-store";
import MailStatusCell from "../../../common/mail-status-cell";
import StatusCell from "../../../common/status-cell";

interface IPromotionListProps {
  promotions: IPromotion[];
  handleEditPromotionDetails: (value: IPromotion) => void;
  handleUpdateStatus: (value: IPromotion) => void;
  refreshData: () => void;
}

export default function PromotionTable({
  promotions,
  handleEditPromotionDetails,
  handleUpdateStatus,
  refreshData,
}: IPromotionListProps) {
  const navigate = useNavigate();
  const {user} = useAuthStore()

  // history states
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryPayload>(initialHistory);

  // mail send states
  const [mailOpen, setMailOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // promotion details
  const [promotionDetails, setPromotionDetails] =
    useState<IPromotion>(initialPromotion);

  const handleOnClick = (row: IPromotion) => {
    handleEditPromotionDetails(row);
  };

  const handleSendMail = (row: IPromotion) => {
    setMailOpen(true);
    setPromotionDetails(row);
  };

  const handleCloseMail = () => {
    setMailOpen(false);
    setPromotionDetails(initialPromotion);
  };

  // define columns for Promotions
  const columns: ColumnDef<IPromotion>[] = [
    {
      header: "#",
      className: "text-center text-gray-500",
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
            description: roleNames[row?.userId?.role],
          }}
          onClick={() => handleOnClick(row)}
        />
      ),
    },
    {
      header: "Designation",
      className: "",
      render: (row) => row.designationId.name,
    },
    {
      header: "Effective From Month",
      className: "",
      render: (row) => formatDate(row.effectiveDate, DateFormat.MONTH_YEAR),
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
                  handleShowHistory(row, HistoryFieldEnum.PromotionMail)
                }
              />
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      header: "Letter",
      className: "",
      render: (row) => {
        return (
          row.status === statusEnum.PROMOTED && (
            <Badge
              label="Letter"
              onClick={() =>
                navigate(`${pathNames.PROMOTION_LETTER}/${row._id}`)
              }
            />
          )
        );
      },
    },
    {
      header: "Status",
      className: "",
      render: (row) => {
        const isManager =
          row.userId._id === user._id && user.role === RoleEnum.MANAGER;
        return (
          <StatusCell
            status={row.status}
            isEditable={!isManager}
            onHistory={() =>
              handleShowHistory(row, HistoryFieldEnum.PromotionStatus)
            }
            onEdit={() => handleUpdateStatus(row)}
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
    promotion: IPromotion,
    field: HistoryFieldEnum,
  ) => {
    handleHistoryOpenClose();
    setHistory({
      field: field,
      fieldId: promotion._id,
      title: `${promotion.userId.firstName} ${promotion.userId.lastName}`,
    });
  };

  const handleSubmitMail = async () => {
    setLoading(true);
    const response = await sendPromotionMail({
      userId: promotionDetails?.userId?._id,
    });
    if (response?.success) {
      refreshData();
      handleCloseMail();
    }
    setLoading(false);
  };

  return (
    <>
      <CustomTable columns={columns} data={promotions} />
      <MailSendModal
        isOpen={mailOpen}
        title={"Are u sure want to send mail for this employee?"}
        showFullTitle
        profileImage={promotionDetails?.userId?.profileImage}
        loading={loading}
        handleOpenClose={handleCloseMail}
        handleSubmit={handleSubmitMail}
      >
        <div className="text-[13px] font-[400] text-inputLabel flex flex-col gap-2">
          <p>
            Dear{" "}
            <span id="interviewerNameGreeting">
              {promotionDetails?.userId?.firstName}{" "}
              {promotionDetails?.userId?.lastName}
            </span>
            ,
          </p>

          <p>
            We are pleased to inform you that based on your consistent
            performance, dedication, and valuable contribution to the
            organization, you have been promoted from <b>Jr. Site Engineer</b>{" "}
            to <b>Sr. Site Engineer</b>, effective from month{" "}
            <b>
              {formatDate(
                promotionDetails.effectiveDate,
                DateFormat.MONTH_YEAR,
              )}
            </b>
            .
          </p>

          <p>
            Your commitment to quality work, teamwork, and professional growth
            has been recognized and appreciated by the management.
          </p>

          <p>
            In your new role, you will be entrusted with greater
            responsibilities and are expected to continue demonstrating the same
            level of excellence and leadership.
          </p>

          <p>
            Further details regarding your revised compensation and
            responsibilities will be shared separately by the HR department.
          </p>

          <p>
            Congratulations on your well-deserved promotion. We look forward to
            your continued success with the organization.
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
        isMailHistory={history.field === HistoryFieldEnum.PromotionMail}
      />
    </>
  );
}
