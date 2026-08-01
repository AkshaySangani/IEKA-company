import Modal from "./Modal";
import excliMinate from "../../../assets/images/excliminate.png";
import Image from "../image";
import Button from "../button/Button";

interface IMailSendProps {
  isOpen: boolean;
  title: string;
  profileImage: string;
  showFullTitle?: boolean;
  loading: boolean;
  children: React.ReactNode;
  handleOpenClose: () => void;
  handleSubmit: () => void;
}

const MailSendModal: React.FC<IMailSendProps> = ({
  isOpen,
  title = "",
  profileImage = excliMinate,
  showFullTitle = false,
  handleOpenClose,
  handleSubmit,
  loading,
  children
}) => {
  const handleConfirm = async () => {
    await handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Send Mail"
      width="max-w-3xl"
      onClose={handleOpenClose}
      loading={loading}
      showFooter={false}
    >
      <>
        <div className="mb-4 flex flex-col border-b border-gray-300 items-center gap-2 text-center pb-3">
          <Image
            src={profileImage}
            fallbackSrc={excliMinate}
            alt="excliMinate"
            width={50}
          />

          <h3 className="text-lg font-medium">
            {showFullTitle ? title : `Are you sure you want to update status for this ${title}?`}
          </h3>
        </div>
        {children}
        <div className="border-t mt-3 border-gray-300 px-6 pt-4 flex justify-center gap-3">
            <Button
              loading={loading}
              variant="primary"
              disabled={loading}
              name={"Send"}
              size="sm"
              onClick={handleConfirm}
              leftIcon={<i className="fa fa-paper-plane"></i>}
            />

            <Button
              name="Close"
              size="sm"
              variant="secondary"
              onClick={handleOpenClose}
            />
          </div>
      </>
    </Modal>
  );
};

export default MailSendModal;
