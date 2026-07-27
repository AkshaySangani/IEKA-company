import { ColumnDef, CustomTable } from "../../../common/table";
import {
  pathNames,
  roleNames,
  statusColor,
  statusMessage,
} from "../../../../constants/constants";
import { initialPromotion, IPromotion } from ".";
import InfoIcon from "../../../../assets/icons/Info";
import { useState } from "react";
import PersonInfo from "../../../common/person-info";
import { statusEnum } from "../../../../types/common-types";
import { useNavigate } from "react-router-dom";
import { DateFormat, formatDate } from "../../../../utils/date-format";
import Badge from "../../../common/badge/Badge";
import MailSendModal from "../../../common/modal/MailSendModal";
import { sendPromotionMail } from "../../../../apis/workforce/promotion.api";

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
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [mailOpen, setMailOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
  const columns: ColumnDef<IPromotion>[] = [
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
      header: "Designation",
      className: "w-[15%]",
      render: (row) => row.designationId.name,
    },
    {
      header: "Effective From Month",
      className: "w-[15%]",
      render: (row) => formatDate(row.effectiveDate, DateFormat.MONTH_YEAR),
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
            <InfoIcon onClick={() => handleShowHistory(row)} />
          </div>
        ) : (
          <>-</>
        ),
    },
    {
      header: "Letter",
      className: "w-[10%]",
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
      className: "w-[12%]",
      render: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            {/* Info SVG icon asset matching your design layout */}
            <InfoIcon onClick={() => handleShowHistory(row)} />
            {row.status !== statusEnum.CANCEL && (
              <i
                onClick={() => handleUpdateStatus(row)}
                className="fa-solid fa-pen-to-square cursor-pointer text-gray-400 hover:text-gray-500"
              ></i>
            )}
            <span
              className={`font-semibold text-sm ${statusColor[row.status]}`}
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
    // setPromotionDetails(initialPromotion);
  };

  // handle show history
  const handleShowHistory = (branch: IPromotion) => {
    handleHistoryOpenClose();
    // setPromotionDetails(branch);
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
              <span id="actionbyname">Arjunsinh Rathod</span>
            </strong>
          </p>
          <p>Manager</p>
        </div>
      </MailSendModal>
      {/* <StatusHistory isOpen={historyOpen} handleOpenClose={handleHistoryOpenClose} leaveDetailss={leaveDetails} /> */}
    </>
  );
}
