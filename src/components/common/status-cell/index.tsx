import InfoIcon from "../../../assets/icons/Info";
import { statusColor, statusMessage } from "../../../constants/constants";
import useDevice from "../../../hooks/useDevice";
import { statusEnum } from "../../../types/common-types";

interface StatusCellProps {
  status: statusEnum;
  isEditable?: boolean;

  onEdit?: () => void;
  onHistory?: () => void;

  showHistory?: boolean;
}

const StatusCell = ({
  status,
  isEditable = true,
  onEdit,
  onHistory,
  showHistory = true,
}: StatusCellProps) => {
  const {isMobile} = useDevice();
  return (
    <div className="flex items-center gap-1">
      {/* Status */}
      <span
        className={`
          min-w-[60px]
          whitespace-nowrap
          text-sm font-medium
          ${statusColor[status] ?? "text-secondary/50"}
        `}
      >
        {statusMessage[status] ?? status}
      </span>

      {/* History */}
      <div className="flex w-5 shrink-0 items-center justify-center">
        {showHistory && <InfoIcon onClick={onHistory} className=""/>}
      </div>

      {/* Edit */}
      <div className="flex w-5 shrink-0 items-center justify-center">
        {isEditable && (
          <i
            className="fa-solid fa-pen-to-square cursor-pointer text-lg sm:text-sm text-grayText/70"
            onClick={onEdit}
          />
        )}
      </div>
    </div>
  );
};

export default StatusCell;