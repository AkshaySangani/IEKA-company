import { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import TextField from "../../../common/text-field/TextField";
import TextAreaField from "../../../common/text-area/TextAreaField";
import RadioButton from "../../../common/radio-button";
import {
  branchEnum,
  branchOptions,
  statusOptions,
  yesNoOption,
} from "../../../../constants/constants";
import { addBranch, updateBranch, updateBranchStatus } from "../../../../apis/organization/branch.api";
import { BranchType, statusEnum } from "../../../../types/common-types";
import { IDepartment } from ".";

interface IStatusHistoryProps {
  isOpen: boolean;
  handleOpenClose: () => void;
  shiftDetails: IDepartment;
}

interface BranchFormData {
  status: string;
  remarks: string;
}

const initialFormData: BranchFormData = {
  status: statusEnum.ACTIVE,
  remarks: ""
};

const StatusHistory: React.FC<IStatusHistoryProps> = ({
  isOpen,
  handleOpenClose,
  shiftDetails
}) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BranchFormData>(initialFormData);

  const handleClose = () => {
    handleOpenClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={shiftDetails?.name}
      width="max-w-xl"
      onClose={handleClose}
      loading={loading}
      showFooter={false}
    >
      <div className="grid grid-cols-1 w-[75%] gap-4">
        
      </div>
    </Modal>
  );
};

export default StatusHistory;
