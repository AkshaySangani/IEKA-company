import InfoIcon from "../../../assets/icons/Info";

interface MailStatusCellProps {
  mailSent: boolean;
  onSendMail?: () => void;
  onHistory?: () => void;
  showSendMail?: boolean;
  showHistory?: boolean;
}

const MailStatusCell = ({
  mailSent,
  onSendMail,
  onHistory,
  showSendMail = true,
  showHistory = true,
}: MailStatusCellProps) => {
  return (
    <div className="flex min-w-max items-center gap-1">
      {/* Mail Status */}
      <div className="flex items-center">
        <span className="whitespace-nowrap text-sm text-secondary/60">
          {mailSent ? "Yes" : "No"}
        </span>
      </div>

      {/* Send Mail - fixed width */}
      <div className="flex items-center justify-center">
        {showSendMail && (
          <button
            type="button"
            onClick={onSendMail}
            className="
              flex h-5 w-5 items-center justify-center
              text-gray-400
              transition-colors
              hover:text-gray-500
            "
          >
            <i className="fa fa-envelope text-sm" />
          </button>
        )}
      </div>

      {/* History - fixed width */}
      <div className="flex items-center justify-center">
        {showHistory && (
          <button
            type="button"
            onClick={onHistory}
            className="flex h-5 w-5 items-center justify-center"
          >
            <InfoIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default MailStatusCell;