import Modal from "../../../common/modal/Modal";
import { Link } from "react-router-dom";
import { config } from "../../../../utils/config";
import { copyToClipboard } from "../../../../utils/copyText";
import { pathNames } from "../../../../constants/constants";
import { useAuthStore } from "../../../../store/auth-store";
import Button from "../../../common/button/Button";

interface IAddEmployeeProps {
  isOpen: boolean;
  handleOpenClose: () => void;
}

const AddEmployee: React.FC<IAddEmployeeProps> = ({
  isOpen,
  handleOpenClose,
}) => {
    const {user} = useAuthStore();
  const url = `${config.FRONTEND_URL}${pathNames.INVITE_EMPLOYEE_FORM}/${user?.company._id}`;

  const handleClose = () => {
    handleOpenClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={"Add Employee"}
      width="max-w-xl"
      onClose={handleClose}
      showFooter={false}
    >
      <div className="flex flex-col sm:items-start gap-2">
        <label className="font-medium text-inputLabel">
          Employee Form Link:
        </label>
        <Link
          to={url}
          className="text-primary hover:underline text-ellipsis"
          target="_blank"
        >
          {url}
        </Link>
        <Button name="Copy" size="sm" className="w-fit" onClick={() => copyToClipboard(url)} leftIcon={<i className="fa-solid fa-copy"></i>} />
      </div>
    </Modal>
  );
};

export default AddEmployee;
