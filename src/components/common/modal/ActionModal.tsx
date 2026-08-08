import Modal from "./Modal";
import excliMinate from "../../../assets/images/excliminate.png";
import Image from "../image";

interface IStatusUpdateProps {
  isOpen: boolean;
  title: string;
  loading: boolean;
  handleOpenClose: () => void;
  handleSubmit: () => void;
}

const ActionModal: React.FC<IStatusUpdateProps> = ({
  isOpen,
  title = "",
  handleOpenClose,
  handleSubmit,
  loading,
}) => {

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await handleSubmit();
    handleOpenClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Alert"
      width="max-w-xl"
      onClose={handleOpenClose}
      loading={loading}
      handleOnConfirm={handleConfirm}
    >
      <>
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <Image
            src={excliMinate}
            fallbackSrc={excliMinate}
            alt="excliMinate"
            width={50}
          />

          <h3 className="text-lg font-medium">
            {title}
          </h3>
        </div>
      </>
    </Modal>
  );
};

export default ActionModal;
