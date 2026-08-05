import Modal from "./Modal";
import check from "../../../assets/images/check.png";
import Image from "../image";
import Button from "../button/Button";

interface IStatusUpdateProps {
  isOpen: boolean;
  title: string;
  handleOpenClose: () => void;
}

const SuccessModal: React.FC<IStatusUpdateProps> = ({
  isOpen,
  title = "",
  handleOpenClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Success"
      width="max-w-xl"
      onClose={handleOpenClose}
      handleOnConfirm={handleOpenClose}
      showFooter={false}
    >
      <>
        <div className=" flex flex-col items-center gap-2 text-center">
          <Image src={check} fallbackSrc={check} alt="check" width={50} />

          <h3 className="text-lg font-medium">{title}</h3>
          <Button
            variant="primary"
            name={"Ok"}
            size="sm"
            onClick={handleOpenClose}
          />
        </div>
      </>
    </Modal>
  );
};

export default SuccessModal;
